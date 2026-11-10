
package com.landprofiling.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.landprofiling.backend.entity.Worksite;
import com.landprofiling.backend.service.WorksiteService;

@RestController
@RequestMapping("/api/worksites")
public class WorksiteController {

    private final WorksiteService service;

    public WorksiteController(WorksiteService service) {
        this.service = service;
    }

    @GetMapping
    public List<Worksite> getAllWorksites() {
        return service.getAllWorksites();
    }

    @GetMapping("/{workId}")
    public ResponseEntity<Worksite> getWorksiteById(
            @PathVariable("workId") String workId) {

        return service.getWorksiteById(workId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
