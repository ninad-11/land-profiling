
package com.landprofiling.backend.service;

import com.landprofiling.backend.entity.Survey;
import com.landprofiling.backend.entity.SurveyType;
import com.landprofiling.backend.repository.SurveyRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SurveyService {

    private final SurveyRepository repository;

    public SurveyService(SurveyRepository repository) {
        this.repository = repository;
    }

    public List<Survey> getAllSurveys() {
        return repository.findAll();
    }

    public Optional<Survey> getSurveyById(String surveyId) {
        return repository.findById(surveyId);
    }

    public List<Survey> getSurveysByWorkId(String workId) {
        return repository.findByWorkIdOrderBySurveyDateAsc(workId);
    }

    public Optional<Survey> getSurveyByType(
            String workId, SurveyType surveyType) {

        return repository.findByWorkIdAndSurveyType(
                workId, surveyType);
    }
}
