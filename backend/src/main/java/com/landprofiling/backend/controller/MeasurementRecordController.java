package com.landprofiling.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.landprofiling.backend.entity.MeasurementRecord;
import com.landprofiling.backend.service.MeasurementRecordService;

@RestController
@RequestMapping("/api/measurements")
public class MeasurementRecordController {

    private final MeasurementRecordService measurementService;

    public MeasurementRecordController(
            MeasurementRecordService measurementService) {
        this.measurementService = measurementService;
    }

    @GetMapping
    public List<MeasurementRecord> getAllRecords() {
        return measurementService.getAllRecords();
    }

    @GetMapping("/{measurementId}")
    public MeasurementRecord getRecordById(
            @PathVariable String measurementId) {
        return measurementService.getRecordById(measurementId);
    }

    @GetMapping("/worksite/{workId}")
    public List<MeasurementRecord> getRecordsByWorkId(
            @PathVariable String workId) {
        return measurementService.getRecordsByWorkId(workId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MeasurementRecord createRecord(
            @RequestBody MeasurementRecord record) {
        return measurementService.createRecord(record);
    }

    @PutMapping("/{measurementId}")
    public MeasurementRecord updateRecord(
            @PathVariable String measurementId,
            @RequestBody MeasurementRecord record) {
        return measurementService.updateRecord(measurementId, record);
    }

    @DeleteMapping("/{measurementId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRecord(@PathVariable String measurementId) {
        measurementService.deleteRecord(measurementId);
    }
}