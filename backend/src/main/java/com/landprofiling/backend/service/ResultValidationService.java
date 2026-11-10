
package com.landprofiling.backend.service;

import java.util.List;
import java.util.Set;
import java.util.Locale;

import org.springframework.stereotype.Service;

import com.landprofiling.backend.entity.ResultValidation;
import com.landprofiling.backend.repository.ResultValidationRepository;
import com.landprofiling.backend.repository.EarthworkResultRepository;

@Service
public class ResultValidationService {

    private final ResultValidationRepository validationRepository;
    private final EarthworkResultRepository resultRepository;

    private static final Set<String> ALLOWED_STATUSES = Set.of(
        "APPROVED",
        "REJECTED",
        "NEEDS_REVIEW"
    );

    public ResultValidationService(
            ResultValidationRepository validationRepository,
            EarthworkResultRepository resultRepository) {

        this.validationRepository = validationRepository;
        this.resultRepository = resultRepository;
    }

    // Create a new validation record

    public ResultValidation createValidation(
            String resultId,
            ResultValidation validation) {

        // Check whether the earthwork result exists

        if (!resultRepository.existsById(resultId)) {
            throw new IllegalArgumentException(
                "Earthwork result not found: " + resultId);
        }

        // Validate and normalize status

        if (validation.getValidationStatus() == null ||
                validation.getValidationStatus().isBlank()) {

            throw new IllegalArgumentException(
                "Validation status is required.");
        }

        String status = validation.getValidationStatus()
                .trim()
                .toUpperCase(Locale.ROOT);

        if (!ALLOWED_STATUSES.contains(status)) {
            throw new IllegalArgumentException(
                "Invalid status. Allowed values: APPROVED, REJECTED, NEEDS_REVIEW.");
        }

        validation.setValidationStatus(status);
        validation.setResultId(resultId);

        // Save validation record

        ResultValidation saved =
                validationRepository.save(validation);

        // Reload to obtain database-generated timestamp

        return validationRepository
                .findById(saved.getValidationId())
                .orElse(saved);
    }

    // Get validation history for a result

    public List<ResultValidation> getValidationHistory(
            String resultId) {

        if (!resultRepository.existsById(resultId)) {
            throw new IllegalArgumentException(
                "Earthwork result not found: " + resultId);
        }

        return validationRepository
                .findByResultIdOrderByValidatedAtDesc(resultId);
    }

    // Get all validation records

    public List<ResultValidation> getAllValidations() {

        return validationRepository
                .findAllByOrderByValidatedAtDesc();
    }
}
