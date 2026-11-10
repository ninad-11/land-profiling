
package com.landprofiling.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.landprofiling.backend.entity.ResultValidation;

public interface ResultValidationRepository
        extends JpaRepository<ResultValidation, Long> {

    List<ResultValidation> findByResultIdOrderByValidatedAtDesc(
            String resultId);

    List<ResultValidation> findAllByOrderByValidatedAtDesc();
}
