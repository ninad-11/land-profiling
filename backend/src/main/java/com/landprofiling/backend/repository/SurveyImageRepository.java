
package com.landprofiling.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.landprofiling.backend.entity.SurveyImage;

public interface SurveyImageRepository
        extends JpaRepository<SurveyImage, Long> {

    List<SurveyImage> findBySurveyIdOrderByUploadedAtDesc(
            String surveyId);
}
