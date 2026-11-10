package com.landprofiling.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.landprofiling.backend.entity.EarthworkEstimate;

public interface EarthworkEstimateRepository
        extends JpaRepository<EarthworkEstimate, String> {

    List<EarthworkEstimate> findByWorkId(String workId);

    List<EarthworkEstimate> findByWorkIdOrderByEstimateDateDesc(
            String workId);
}