
package com.landprofiling.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.landprofiling.backend.entity.ResultValidation;
import com.landprofiling.backend.service.ResultValidationService;

@RestController
@RequestMapping("/api/validations")
public class ResultValidationController {

    private final ResultValidationService validationService;

    public ResultValidationController(
            ResultValidationService validationService) {

        this.validationService = validationService;
    }

    // Create a validation record

    @PostMapping("/result/{resultId}")
    public ResponseEntity<?> createValidation(
            @PathVariable String resultId,
            @RequestBody ResultValidation validation) {

        try {
            ResultValidation saved =
                    validationService.createValidation(
                        resultId, validation);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(saved);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // Get validation history for a particular result

    @GetMapping("/result/{resultId}")
    public ResponseEntity<?> getValidationHistory(
            @PathVariable String resultId) {

        try {
            List<ResultValidation> history =
                    validationService.getValidationHistory(resultId);

            return ResponseEntity.ok(history);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    // Get all validation records

    @GetMapping
    public ResponseEntity<List<ResultValidation>> getAllValidations() {

        return ResponseEntity.ok(
                validationService.getAllValidations());
    }
}
