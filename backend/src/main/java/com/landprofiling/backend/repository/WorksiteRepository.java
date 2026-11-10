package com.landprofiling.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.landprofiling.backend.entity.Worksite;

public interface WorksiteRepository
        extends JpaRepository<Worksite, String> {
}