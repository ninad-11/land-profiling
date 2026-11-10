package com.landprofiling.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.landprofiling.backend.entity.MeasurementRecord;

public interface MeasurementRecordRepository
        extends JpaRepository<MeasurementRecord, String> {

    List<MeasurementRecord> findByWorkId(String workId);

    List<MeasurementRecord> findByWorkIdOrderByMeasurementDateDesc(
            String workId);
}