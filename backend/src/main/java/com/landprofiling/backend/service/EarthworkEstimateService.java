package com.landprofiling.backend.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.landprofiling.backend.entity.EarthworkEstimate;
import com.landprofiling.backend.repository.EarthworkEstimateRepository;
import com.landprofiling.backend.repository.WorksiteRepository;

@Service
public class EarthworkEstimateService {

    private final EarthworkEstimateRepository estimateRepository;
    private final WorksiteRepository worksiteRepository;

    public EarthworkEstimateService(
            EarthworkEstimateRepository estimateRepository,
            WorksiteRepository worksiteRepository) {
        this.estimateRepository = estimateRepository;
        this.worksiteRepository = worksiteRepository;
    }

    public List<EarthworkEstimate> getAllEstimates() {
        return estimateRepository.findAll();
    }

    public EarthworkEstimate getEstimateById(String estimateId) {
        return estimateRepository.findById(estimateId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Estimate not found"));
    }

    public List<EarthworkEstimate> getEstimatesByWorkId(String workId) {

        if (!worksiteRepository.existsById(workId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Worksite not found");
        }

        return estimateRepository.findByWorkId(workId);
    }

    @Transactional
    public EarthworkEstimate createEstimate(EarthworkEstimate estimate) {

        if (estimateRepository.existsById(estimate.getEstimateId())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Estimate ID already exists");
        }

        if (!worksiteRepository.existsById(estimate.getWorkId())) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Worksite not found");
        }

        return estimateRepository.save(estimate);
    }

    @Transactional
    public EarthworkEstimate updateEstimate(
            String estimateId, EarthworkEstimate updatedEstimate) {

        EarthworkEstimate existing = getEstimateById(estimateId);

        if (!worksiteRepository.existsById(updatedEstimate.getWorkId())) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Worksite not found");
        }

        existing.setWorkId(updatedEstimate.getWorkId());
        existing.setEstimatedQuantityM3(
                updatedEstimate.getEstimatedQuantityM3());
        existing.setEstimateDate(updatedEstimate.getEstimateDate());
        existing.setQuantityBasis(updatedEstimate.getQuantityBasis());
        existing.setDataStatus(updatedEstimate.getDataStatus());

        return estimateRepository.save(existing);
    }

    @Transactional
    public void deleteEstimate(String estimateId) {

        EarthworkEstimate estimate = getEstimateById(estimateId);
        estimateRepository.delete(estimate);
    }
}