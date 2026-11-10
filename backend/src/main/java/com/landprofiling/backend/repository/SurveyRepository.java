
package com.landprofiling.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.landprofiling.backend.entity.Survey;
import com.landprofiling.backend.entity.SurveyType;

@Repository
public interface SurveyRepository
        extends JpaRepository<Survey, String> {

    List<Survey> findByWorkIdOrderBySurveyDateAsc(String workId);

    Optional<Survey> findByWorkIdAndSurveyType(
            String workId, SurveyType surveyType);
}
