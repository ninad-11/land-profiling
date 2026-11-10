
package com.landprofiling.backend.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.landprofiling.backend.dto.TerrainAnalysisResponse;
import com.landprofiling.backend.dto.TerrainProcessingResultResponse;
import com.landprofiling.backend.entity.EarthworkEstimate;
import com.landprofiling.backend.entity.EarthworkResult;
import com.landprofiling.backend.entity.MeasurementRecord;
import com.landprofiling.backend.repository.EarthworkEstimateRepository;
import com.landprofiling.backend.repository.EarthworkResultRepository;
import com.landprofiling.backend.repository.MeasurementRecordRepository;
import com.landprofiling.backend.repository.WorksiteRepository;

@Service
public class TerrainProcessingService {

    private final EarthworkResultRepository resultRepository;
    private final WorksiteRepository worksiteRepository;
    private final EarthworkEstimateRepository estimateRepository;
    private final MeasurementRecordRepository measurementRepository;

    private final RestTemplate restTemplate;
    private final String processingUrl;

    public TerrainProcessingService(
            EarthworkResultRepository resultRepository,
            WorksiteRepository worksiteRepository,
            EarthworkEstimateRepository estimateRepository,
            MeasurementRecordRepository measurementRepository,
            @Value("${app.processing.url:http://127.0.0.1:8000}")
            String processingUrl) {

        this.resultRepository = resultRepository;
        this.worksiteRepository = worksiteRepository;
        this.estimateRepository = estimateRepository;
        this.measurementRepository = measurementRepository;
        this.processingUrl = processingUrl;

        this.restTemplate = new RestTemplate();
    }

    public TerrainProcessingResultResponse processTerrain(
            String workId,
            MultipartFile preFile,
            MultipartFile postFile) throws Exception {

        if (!worksiteRepository.existsById(workId)) {
            throw new IllegalArgumentException(
                "Worksite not found: " + workId);
        }

        if (preFile.isEmpty() || postFile.isEmpty()) {
            throw new IllegalArgumentException(
                "Both DEM files are required.");
        }

        // Send DEM files to Python FastAPI

        MultiValueMap<String, Object> body =
                new LinkedMultiValueMap<>();

        body.add("pre_file", createResource(preFile));
        body.add("post_file", createResource(postFile));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        HttpEntity<MultiValueMap<String, Object>> request =
                new HttpEntity<>(body, headers);

        TerrainAnalysisResponse analysis =
                restTemplate.postForObject(
                    processingUrl + "/analyze-dem",
                    request,
                    TerrainAnalysisResponse.class
                );

        if (analysis == null ||
                !"success".equals(analysis.getStatus())) {

            throw new IllegalStateException(
                "Python terrain processing failed.");
        }

        // Create Earthwork Result

        EarthworkResult result = new EarthworkResult();

        result.setResultId(
            "RES-" + UUID.randomUUID()
                    .toString()
                    .substring(0, 8)
                    .toUpperCase()
        );

        result.setWorkId(workId);

        result.setCutVolumeM3(analysis.getCutVolumeM3());
        result.setFillVolumeM3(analysis.getFillVolumeM3());
        result.setNetCutVolumeM3(analysis.getNetCutVolumeM3());

        // Retrieve latest estimate

        List<EarthworkEstimate> estimates =
                estimateRepository
                    .findByWorkIdOrderByEstimateDateDesc(workId);

        BigDecimal estimatedQuantity = null;

        if (!estimates.isEmpty()) {
            estimatedQuantity =
                estimates.get(0).getEstimatedQuantityM3();
        }

        result.setEstimatedQuantityM3(estimatedQuantity);

        // Retrieve latest Measurement Book record

        List<MeasurementRecord> measurements =
                measurementRepository
                    .findByWorkIdOrderByMeasurementDateDesc(workId);

        BigDecimal recordedQuantity = null;

        if (!measurements.isEmpty()) {
            recordedQuantity =
                measurements.get(0).getRecordedQuantityM3();
        }

        result.setRecordedQuantityM3(recordedQuantity);

        // Calculate estimate deviation

        BigDecimal calculatedQuantity =
                analysis.getNetCutVolumeM3();

        if (estimatedQuantity != null) {

            BigDecimal estimateDifference =
                    calculatedQuantity
                        .subtract(estimatedQuantity)
                        .abs();

            result.setAbsoluteDifferenceM3(
                estimateDifference.setScale(3, RoundingMode.HALF_UP)
            );

            result.setDifferencePercent(
                calculatePercentage(
                    estimateDifference,
                    estimatedQuantity
                )
            );

        } else {
            result.setAbsoluteDifferenceM3(null);
            result.setDifferencePercent(null);
        }

        // Calculate Measurement Book deviation

        if (recordedQuantity != null) {

            BigDecimal mbDifference =
                    calculatedQuantity
                        .subtract(recordedQuantity)
                        .abs();

            result.setMbDifferenceM3(
                mbDifference.setScale(3, RoundingMode.HALF_UP)
            );

            result.setMbDifferencePercent(
                calculatePercentage(
                    mbDifference,
                    recordedQuantity
                )
            );

        } else {
            result.setMbDifferenceM3(null);
            result.setMbDifferencePercent(null);
        }

        // Calculation details

        result.setCalculationMethod(
            "DEM comparison using PRE and POST elevation surfaces. "
            + "Pixel area: " + analysis.getPixelAreaM2()
            + " m2. CRS: " + analysis.getCoordinateReference()
            + ". Comparison basis: net cut volume."
        );

        result.setDataStatus(
            "CALCULATED - VALIDATION REQUIRED"
        );

        // Save final earthwork result

        EarthworkResult savedResult = resultRepository.save(result);

        // Build visualization URLs
        TerrainProcessingResultResponse.Visualizations visualizations =
                new TerrainProcessingResultResponse.Visualizations();

        if (analysis.getVisualizations() != null) {

            String baseUrl = processingUrl + analysis.getVisualizations().getTerrain2d();

            visualizations.setTerrain2d(baseUrl);

            visualizations.setTerrain3dComparison(
                    processingUrl + analysis.getVisualizations().getTerrain3dComparison()
            );

            visualizations.setTerrain3dDifference(
                    processingUrl + analysis.getVisualizations().getTerrain3dDifference()
            );

            visualizations.setContourComparison(
                    processingUrl + analysis.getVisualizations().getContourComparison()
            );
        }

        // Return result and visualization information
        return new TerrainProcessingResultResponse(
                savedResult,
                analysis.getAnalysisId(),
                analysis.getDataStatus(),
                visualizations
        );
    }

    private BigDecimal calculatePercentage(
            BigDecimal difference,
            BigDecimal referenceQuantity) {

        if (referenceQuantity == null ||
                referenceQuantity.compareTo(BigDecimal.ZERO) == 0) {
            return null;
        }

        return difference
                .multiply(BigDecimal.valueOf(100))
                .divide(referenceQuantity, 3, RoundingMode.HALF_UP);
    }

    private ByteArrayResource createResource(
            MultipartFile file) throws Exception {

        String filename = file.getOriginalFilename();

        return new ByteArrayResource(file.getBytes()) {

            @Override
            public String getFilename() {
                return filename != null
                        ? filename
                        : "terrain.tif";
            }
        };
    }
}
