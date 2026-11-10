package com.landprofiling.backend.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "earthwork_estimates")
public class EarthworkEstimate {

    @Id
    @Column(name = "estimate_id", length = 30)
    private String estimateId;

    @Column(name = "work_id", nullable = false, length = 20)
    private String workId;

    @Column(name = "estimated_quantity_m3", nullable = false,
            precision = 12, scale = 3)
    private BigDecimal estimatedQuantityM3;

    @Column(name = "estimate_date")
    private LocalDate estimateDate;

    @Column(name = "quantity_basis", length = 200)
    private String quantityBasis;

    @Column(name = "data_status", nullable = false, length = 50)
    private String dataStatus = "DEMO";

    public EarthworkEstimate() {
    }

    public String getEstimateId() {
        return estimateId;
    }

    public void setEstimateId(String estimateId) {
        this.estimateId = estimateId;
    }

    public String getWorkId() {
        return workId;
    }

    public void setWorkId(String workId) {
        this.workId = workId;
    }

    public BigDecimal getEstimatedQuantityM3() {
        return estimatedQuantityM3;
    }

    public void setEstimatedQuantityM3(BigDecimal estimatedQuantityM3) {
        this.estimatedQuantityM3 = estimatedQuantityM3;
    }

    public LocalDate getEstimateDate() {
        return estimateDate;
    }

    public void setEstimateDate(LocalDate estimateDate) {
        this.estimateDate = estimateDate;
    }

    public String getQuantityBasis() {
        return quantityBasis;
    }

    public void setQuantityBasis(String quantityBasis) {
        this.quantityBasis = quantityBasis;
    }

    public String getDataStatus() {
        return dataStatus;
    }

    public void setDataStatus(String dataStatus) {
        this.dataStatus = dataStatus;
    }
}