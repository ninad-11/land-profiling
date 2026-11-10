
package com.landprofiling.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.landprofiling.backend.dto.DeviationWarningResponse;
import com.landprofiling.backend.service.DeviationWarningService;

@RestController
@RequestMapping("/api/warnings")
public class DeviationWarningController {

    private final DeviationWarningService warningService;

    public DeviationWarningController(
            DeviationWarningService warningService) {

        this.warningService = warningService;
    }

    // Get warning for a specific result

    @GetMapping("/result/{resultId}")
    public ResponseEntity<?> getWarning(
            @PathVariable String resultId) {

        try {
            return ResponseEntity.ok(
                    warningService.getWarning(resultId));

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    // Get warnings for all results

    @GetMapping
    public ResponseEntity<List<DeviationWarningResponse>>
            getAllWarnings() {

        return ResponseEntity.ok(
                warningService.getAllWarnings());
    }

    // Get warnings for a specific worksite

    @GetMapping("/worksite/{workId}")
    public ResponseEntity<List<DeviationWarningResponse>>
            getWarningsByWorksite(
                    @PathVariable String workId) {

        return ResponseEntity.ok(
                warningService.getWarningsByWorksite(workId));
    }
}
