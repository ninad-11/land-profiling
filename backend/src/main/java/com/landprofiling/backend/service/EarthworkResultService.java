package com.landprofiling.backend.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.landprofiling.backend.entity.EarthworkResult;
import com.landprofiling.backend.repository.EarthworkResultRepository;
import com.landprofiling.backend.repository.WorksiteRepository;

@Service
public class EarthworkResultService {

    private final EarthworkResultRepository resultRepository;
    private final WorksiteRepository worksiteRepository;

    public EarthworkResultService(
            EarthworkResultRepository resultRepository,
            WorksiteRepository worksiteRepository) {

        this.resultRepository = resultRepository;
        this.worksiteRepository = worksiteRepository;
    }

    public List<EarthworkResult> getAllResults() {
        return resultRepository.findAll();
    }

    public EarthworkResult getResultById(String resultId) {
        return resultRepository.findById(resultId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Earthwork result not found"));
    }

    public List<EarthworkResult> getResultsByWorkId(String workId) {

        if (!worksiteRepository.existsById(workId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Worksite not found");
        }

        return resultRepository.findByWorkId(workId);
    }
}