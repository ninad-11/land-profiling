package com.landprofiling.backend.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "measurement_records")
public class MeasurementRecord {

    @Id
    @Column(name = "measurement_id", length = 30)
    private String measurementId;

    @Column(name = "work_id", nullable = false, length = 20)
    private String workId;

    @Column(name = "recorded_quantity_m3", nullable = false,
            precision = 12, scale = 3)
    private BigDecimal recordedQuantityM3;

    @Column(name = "measurement_date")
    private LocalDate measurementDate;

    @Column(name = "quantity_basis", length = 200)
    private String quantityBasis;

    @Column(name = "data_status", nullable = false, length = 50)
    private String dataStatus = "DEMO";

    public MeasurementRecord() {
    }

    public String getMeasurementId() {
        return measurementId;
    }

    public void setMeasurementId(String measurementId) {
        this.measurementId = measurementId;
    }

    public String getWorkId() {
        return workId;
    }

    public void setWorkId(String workId) {
        this.workId = workId;
    }

    public BigDecimal getRecordedQuantityM3() {
        return recordedQuantityM3;
    }

    public void setRecordedQuantityM3(BigDecimal recordedQuantityM3) {
        this.recordedQuantityM3 = recordedQuantityM3;
    }

    public LocalDate getMeasurementDate() {
        return measurementDate;
    }

    public void setMeasurementDate(LocalDate measurementDate) {
        this.measurementDate = measurementDate;
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