
package com.landprofiling.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.landprofiling.backend.entity.Gcp;

public interface GcpRepository
        extends JpaRepository<Gcp, String> {

    List<Gcp> findByWorkId(String workId);
}
