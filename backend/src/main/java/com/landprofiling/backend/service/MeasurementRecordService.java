package com.landprofiling.backend.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.landprofiling.backend.entity.MeasurementRecord;
import com.landprofiling.backend.repository.MeasurementRecordRepository;
import com.landprofiling.backend.repository.WorksiteRepository;

@Service
public class MeasurementRecordService {

    private final MeasurementRecordRepository measurementRepository;
    private final WorksiteRepository worksiteRepository;

    public MeasurementRecordService(
            MeasurementRecordRepository measurementRepository,
            WorksiteRepository worksiteRepository) {

        this.measurementRepository = measurementRepository;
        this.worksiteRepository = worksiteRepository;
    }

    public List<MeasurementRecord> getAllRecords() {
        return measurementRepository.findAll();
    }

    public MeasurementRecord getRecordById(String measurementId) {
        return measurementRepository.findById(measurementId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Measurement record not found"));
    }

    public List<MeasurementRecord> getRecordsByWorkId(String workId) {

        if (!worksiteRepository.existsById(workId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Worksite not found");
        }

        return measurementRepository.findByWorkId(workId);
    }

    @Transactional
    public MeasurementRecord createRecord(MeasurementRecord record) {

        if (measurementRepository.existsById(record.getMeasurementId())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Measurement ID already exists");
        }

        if (!worksiteRepository.existsById(record.getWorkId())) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Worksite not found");
        }

        return measurementRepository.save(record);
    }

    @Transactional
    public MeasurementRecord updateRecord(
            String measurementId, MeasurementRecord updatedRecord) {

        MeasurementRecord existing = getRecordById(measurementId);

        if (!worksiteRepository.existsById(updatedRecord.getWorkId())) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Worksite not found");
        }

        existing.setWorkId(updatedRecord.getWorkId());
        existing.setRecordedQuantityM3(
                updatedRecord.getRecordedQuantityM3());
        existing.setMeasurementDate(updatedRecord.getMeasurementDate());
        existing.setQuantityBasis(updatedRecord.getQuantityBasis());
        existing.setDataStatus(updatedRecord.getDataStatus());

        return measurementRepository.save(existing);
    }

    @Transactional
    public void deleteRecord(String measurementId) {

        MeasurementRecord record = getRecordById(measurementId);
        measurementRepository.delete(record);
    }
}