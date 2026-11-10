
package com.landprofiling.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.landprofiling.backend.entity.Worksite;
import com.landprofiling.backend.repository.WorksiteRepository;

@Service
public class WorksiteService {

    private final WorksiteRepository repository;

    public WorksiteService(WorksiteRepository repository) {
        this.repository = repository;
    }

    public List<Worksite> getAllWorksites() {
        return repository.findAll();
    }

    public Optional<Worksite> getWorksiteById(String workId) {
        return repository.findById(workId);
    }
}
