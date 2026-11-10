
package com.landprofiling.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.landprofiling.backend.entity.Survey;
import com.landprofiling.backend.entity.SurveyType;
import com.landprofiling.backend.service.SurveyService;

@RestController
@RequestMapping("/api/surveys")
public class SurveyController {

    private final SurveyService service;

    public SurveyController(SurveyService service) {
        this.service = service;
    }

    // Get all surveys
    @GetMapping
    public List<Survey> getAllSurveys() {
        return service.getAllSurveys();
    }

    // Get survey by ID
    @GetMapping("/{surveyId}")
    public ResponseEntity<Survey> getSurveyById(
            @PathVariable String surveyId) {

        return service.getSurveyById(surveyId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get surveys belonging to a worksite
    @GetMapping("/worksite/{workId}")
    public List<Survey> getSurveysByWorkId(
            @PathVariable String workId) {

        return service.getSurveysByWorkId(workId);
    }

    // Get PRE or POST survey
    @GetMapping("/worksite/{workId}/{surveyType}")
    public ResponseEntity<Survey> getSurveyByType(
            @PathVariable String workId,
            @PathVariable SurveyType surveyType) {

        return service.getSurveyByType(workId, surveyType)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
