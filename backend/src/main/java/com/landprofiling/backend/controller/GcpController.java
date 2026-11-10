
package com.landprofiling.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.landprofiling.backend.entity.Gcp;
import com.landprofiling.backend.service.GcpService;

@RestController
@RequestMapping("/api/gcps")
public class GcpController {

    private final GcpService service;

    public GcpController(GcpService service) {
        this.service = service;
    }

    // Get all GCPs
    @GetMapping
    public List<Gcp> getAllGcps() {
        return service.getAllGcps();
    }

    // Get GCP by ID
    @GetMapping("/{gcpId}")
    public ResponseEntity<Gcp> getGcpById(
            @PathVariable String gcpId) {

        return service.getGcpById(gcpId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get GCPs belonging to a worksite
    @GetMapping("/worksite/{workId}")
    public List<Gcp> getGcpsByWorkId(
            @PathVariable String workId) {

        return service.getGcpsByWorkId(workId);
    }

    // Create a GCP
    @PostMapping
    public ResponseEntity<Gcp> createGcp(@RequestBody Gcp gcp) {

        Gcp saved = service.createGcp(gcp);

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // Update a GCP
    @PutMapping("/{gcpId}")
    public ResponseEntity<Gcp> updateGcp(
            @PathVariable String gcpId,
            @RequestBody Gcp gcp) {

        return ResponseEntity.ok(service.updateGcp(gcpId, gcp));
    }

    // Delete a GCP
    @DeleteMapping("/{gcpId}")
    public ResponseEntity<Void> deleteGcp(
            @PathVariable String gcpId) {

        service.deleteGcp(gcpId);
        return ResponseEntity.noContent().build();
    }
}
