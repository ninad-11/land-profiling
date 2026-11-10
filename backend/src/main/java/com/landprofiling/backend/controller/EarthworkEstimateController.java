package com.landprofiling.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.landprofiling.backend.entity.EarthworkEstimate;
import com.landprofiling.backend.service.EarthworkEstimateService;

@RestController
@RequestMapping("/api/estimates")
public class EarthworkEstimateController {

    private final EarthworkEstimateService estimateService;

    public EarthworkEstimateController(
            EarthworkEstimateService estimateService) {
        this.estimateService = estimateService;
    }

    @GetMapping
    public List<EarthworkEstimate> getAllEstimates() {
        return estimateService.getAllEstimates();
    }

    @GetMapping("/{estimateId}")
    public EarthworkEstimate getEstimateById(
            @PathVariable String estimateId) {
        return estimateService.getEstimateById(estimateId);
    }

    @GetMapping("/worksite/{workId}")
    public List<EarthworkEstimate> getEstimatesByWorkId(
            @PathVariable String workId) {
        return estimateService.getEstimatesByWorkId(workId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EarthworkEstimate createEstimate(
            @RequestBody EarthworkEstimate estimate) {
        return estimateService.createEstimate(estimate);
    }

    @PutMapping("/{estimateId}")
    public EarthworkEstimate updateEstimate(
            @PathVariable String estimateId,
            @RequestBody EarthworkEstimate estimate) {
        return estimateService.updateEstimate(estimateId, estimate);
    }

    @DeleteMapping("/{estimateId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEstimate(@PathVariable String estimateId) {
        estimateService.deleteEstimate(estimateId);
    }
}