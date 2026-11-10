package com.landprofiling.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.landprofiling.backend.entity.EarthworkResult;
import com.landprofiling.backend.service.EarthworkResultService;

@RestController
@RequestMapping("/api/earthwork-results")
public class EarthworkResultController {

    private final EarthworkResultService resultService;

    public EarthworkResultController(
            EarthworkResultService resultService) {
        this.resultService = resultService;
    }

    @GetMapping
    public List<EarthworkResult> getAllResults() {
        return resultService.getAllResults();
    }

    @GetMapping("/{resultId}")
    public EarthworkResult getResultById(
            @PathVariable String resultId) {
        return resultService.getResultById(resultId);
    }

    @GetMapping("/worksite/{workId}")
    public List<EarthworkResult> getResultsByWorkId(
            @PathVariable String workId) {
        return resultService.getResultsByWorkId(workId);
    }
}