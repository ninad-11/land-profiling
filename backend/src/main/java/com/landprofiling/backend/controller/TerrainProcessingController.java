package com.landprofiling.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.landprofiling.backend.dto.TerrainProcessingResultResponse;
import com.landprofiling.backend.service.TerrainProcessingService;

@RestController
@RequestMapping("/api/processing")
public class TerrainProcessingController {

    private final TerrainProcessingService processingService;

    public TerrainProcessingController(
            TerrainProcessingService processingService) {
        this.processingService = processingService;
    }

    @PostMapping(
        value = "/worksite/{workId}/analyze",
        consumes = "multipart/form-data"
    )
    public TerrainProcessingResultResponse analyzeTerrain(
            @PathVariable String workId,
            @RequestParam("preFile") MultipartFile preFile,
            @RequestParam("postFile") MultipartFile postFile) {

        try {
            return processingService.processTerrain(
                    workId, preFile, postFile);

        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, ex.getMessage());

        } catch (Exception ex) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Terrain processing failed: " + ex.getMessage());
        }
    }
}