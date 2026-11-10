
package com.landprofiling.backend.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.landprofiling.backend.dto.DeviationWarningResponse;
import com.landprofiling.backend.entity.EarthworkResult;
import com.landprofiling.backend.repository.EarthworkResultRepository;

@Service
public class DeviationWarningService {

    private final EarthworkResultRepository resultRepository;

    private static final BigDecimal NORMAL_LIMIT =
            new BigDecimal("5.000");

    private static final BigDecimal MODERATE_LIMIT =
            new BigDecimal("10.000");

    public DeviationWarningService(
            EarthworkResultRepository resultRepository) {

        this.resultRepository = resultRepository;
    }

    // Get warning for one result

    public DeviationWarningResponse getWarning(String resultId) {

        EarthworkResult result = resultRepository.findById(resultId)
                .orElseThrow(() -> new IllegalArgumentException(
                    "Earthwork result not found: " + resultId));

        return createWarningResponse(result);
    }

    // Get warnings for all results

    public List<DeviationWarningResponse> getAllWarnings() {

        List<EarthworkResult> results =
                resultRepository.findAll();

        List<DeviationWarningResponse> warnings =
                new ArrayList<>();

        for (EarthworkResult result : results) {
            warnings.add(createWarningResponse(result));
        }

        return warnings;
    }

    // Get warnings for one worksite

    public List<DeviationWarningResponse> getWarningsByWorksite(
            String workId) {

        List<EarthworkResult> results =
                resultRepository.findByWorkId(workId);

        List<DeviationWarningResponse> warnings =
                new ArrayList<>();

        for (EarthworkResult result : results) {
            warnings.add(createWarningResponse(result));
        }

        return warnings;
    }

    // Generate warning response

    private DeviationWarningResponse createWarningResponse(
            EarthworkResult result) {

        DeviationWarningResponse response =
                new DeviationWarningResponse();

        response.setResultId(result.getResultId());
        response.setWorkId(result.getWorkId());

        BigDecimal estimateDeviation =
                result.getDifferencePercent();

        BigDecimal mbDeviation =
                result.getMbDifferencePercent();

        response.setEstimateDeviationPercent(estimateDeviation);
        response.setMbDeviationPercent(mbDeviation);

        String estimateWarning =
                classifyDeviation(estimateDeviation);

        String mbWarning =
                classifyDeviation(mbDeviation);

        response.setEstimateWarning(estimateWarning);
        response.setMbWarning(mbWarning);

        response.setOverallWarning(
                getOverallWarning(estimateWarning, mbWarning));

        return response;
    }

    // Classify deviation

    private String classifyDeviation(BigDecimal deviation) {

        if (deviation == null) {
            return "NOT_AVAILABLE";
        }

        if (deviation.compareTo(NORMAL_LIMIT) <= 0) {
            return "NORMAL";
        }

        if (deviation.compareTo(MODERATE_LIMIT) <= 0) {
            return "MODERATE";
        }

        return "HIGH";
    }

    // Determine overall warning

    private String getOverallWarning(
            String estimateWarning,
            String mbWarning) {

        if ("HIGH".equals(estimateWarning)
                || "HIGH".equals(mbWarning)) {
            return "HIGH";
        }

        if ("MODERATE".equals(estimateWarning)
                || "MODERATE".equals(mbWarning)) {
            return "MODERATE";
        }

        if ("NORMAL".equals(estimateWarning)
                || "NORMAL".equals(mbWarning)) {
            return "NORMAL";
        }

        return "NOT_AVAILABLE";
    }
}
