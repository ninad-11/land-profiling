
package com.landprofiling.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.landprofiling.backend.entity.Gcp;
import com.landprofiling.backend.repository.GcpRepository;
import com.landprofiling.backend.repository.WorksiteRepository;

@Service
public class GcpService {

    private final GcpRepository gcpRepository;
    private final WorksiteRepository worksiteRepository;

    public GcpService(
            GcpRepository gcpRepository,
            WorksiteRepository worksiteRepository) {

        this.gcpRepository = gcpRepository;
        this.worksiteRepository = worksiteRepository;
    }

    public List<Gcp> getAllGcps() {
        return gcpRepository.findAll();
    }

    public Optional<Gcp> getGcpById(String gcpId) {
        return gcpRepository.findById(gcpId);
    }

    public List<Gcp> getGcpsByWorkId(String workId) {
        return gcpRepository.findByWorkId(workId);
    }

    public Gcp createGcp(Gcp gcp) {

        if (gcpRepository.existsById(gcp.getGcpId())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "GCP ID already exists");
        }

        if (!worksiteRepository.existsById(gcp.getWorkId())) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Worksite not found");
        }

        return gcpRepository.save(gcp);
    }

    public Gcp updateGcp(String gcpId, Gcp updatedGcp) {

        Gcp existing = gcpRepository.findById(gcpId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "GCP not found"));

        if (!worksiteRepository.existsById(updatedGcp.getWorkId())) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Worksite not found");
        }

        existing.setWorkId(updatedGcp.getWorkId());
        existing.setXMLocal(updatedGcp.getXMLocal());
        existing.setYMLocal(updatedGcp.getYMLocal());
        existing.setZM(updatedGcp.getZM());
        existing.setReferenceType(updatedGcp.getReferenceType());
        existing.setDataStatus(updatedGcp.getDataStatus());

        return gcpRepository.save(existing);
    }

    public void deleteGcp(String gcpId) {

        if (!gcpRepository.existsById(gcpId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "GCP not found");
        }

        gcpRepository.deleteById(gcpId);
    }
}
