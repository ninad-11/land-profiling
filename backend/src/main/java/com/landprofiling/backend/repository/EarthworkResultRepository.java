package com.landprofiling.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.landprofiling.backend.entity.EarthworkResult;

public interface EarthworkResultRepository
        extends JpaRepository<EarthworkResult, String> {

    List<EarthworkResult> findByWorkId(String workId);
}