package com.landprofiling.backend.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "earthwork_results")
public class EarthworkResult {

    @Id
    @Column(name = "result_id", length = 30)
    private String resultId;

    @Column(name = "work_id", nullable = false, length = 20)
    private String workId;

    @Column(name = "cut_volume_m3", nullable = false,
            precision = 12, scale = 3)
    private BigDecimal cutVolumeM3;

    @Column(name = "fill_volume_m3", nullable = false,
            precision = 12, scale = 3)
    private BigDecimal fillVolumeM3;

    @Column(name = "net_cut_volume_m3", nullable = false,
            precision = 12, scale = 3)
    private BigDecimal netCutVolumeM3;

    @Column(name = "estimated_quantity_m3", precision = 12, scale = 3)
    private BigDecimal estimatedQuantityM3;

    @Column(name = "recorded_quantity_m3", precision = 12, scale = 3)
    private BigDecimal recordedQuantityM3;

    @Column(name = "absolute_difference_m3", precision = 12, scale = 3)
    private BigDecimal absoluteDifferenceM3;

    @Column(name = "difference_percent", precision = 8, scale = 3)
    private BigDecimal differencePercent;

    @Column(name = "mb_difference_m3", precision = 12, scale = 3)
    private BigDecimal mbDifferenceM3;

    @Column(name = "mb_difference_percent", precision = 8, scale = 3)
    private BigDecimal mbDifferencePercent;

    @Column(name = "calculation_method", length = 255)
    private String calculationMethod;

    @Column(name = "data_status", nullable = false, length = 80)
    private String dataStatus = "DEMO - NOT VALIDATED";

    public EarthworkResult() {
    }

    public String getResultId() {
        return resultId;
    }

    public void setResultId(String resultId) {
        this.resultId = resultId;
    }

    public String getWorkId() {
        return workId;
    }

    public void setWorkId(String workId) {
        this.workId = workId;
    }

    public BigDecimal getCutVolumeM3() {
        return cutVolumeM3;
    }

    public void setCutVolumeM3(BigDecimal cutVolumeM3) {
        this.cutVolumeM3 = cutVolumeM3;
    }

    public BigDecimal getFillVolumeM3() {
        return fillVolumeM3;
    }

    public void setFillVolumeM3(BigDecimal fillVolumeM3) {
        this.fillVolumeM3 = fillVolumeM3;
    }

    public BigDecimal getNetCutVolumeM3() {
        return netCutVolumeM3;
    }

    public void setNetCutVolumeM3(BigDecimal netCutVolumeM3) {
        this.netCutVolumeM3 = netCutVolumeM3;
    }

    public BigDecimal getEstimatedQuantityM3() {
        return estimatedQuantityM3;
    }

    public void setEstimatedQuantityM3(BigDecimal estimatedQuantityM3) {
        this.estimatedQuantityM3 = estimatedQuantityM3;
    }

    public BigDecimal getRecordedQuantityM3() {
        return recordedQuantityM3;
    }

    public void setRecordedQuantityM3(BigDecimal recordedQuantityM3) {
        this.recordedQuantityM3 = recordedQuantityM3;
    }

    public BigDecimal getAbsoluteDifferenceM3() {
        return absoluteDifferenceM3;
    }

    public void setAbsoluteDifferenceM3(BigDecimal absoluteDifferenceM3) {
        this.absoluteDifferenceM3 = absoluteDifferenceM3;
    }

    public BigDecimal getDifferencePercent() {
        return differencePercent;
    }

    public void setDifferencePercent(BigDecimal differencePercent) {
        this.differencePercent = differencePercent;
    }

    public BigDecimal getMbDifferenceM3() {
        return mbDifferenceM3;
    }

    public void setMbDifferenceM3(BigDecimal mbDifferenceM3) {
        this.mbDifferenceM3 = mbDifferenceM3;
    }

    public BigDecimal getMbDifferencePercent() {
        return mbDifferencePercent;
    }

    public void setMbDifferencePercent(BigDecimal mbDifferencePercent) {
        this.mbDifferencePercent = mbDifferencePercent;
    }

    public String getCalculationMethod() {
        return calculationMethod;
    }

    public void setCalculationMethod(String calculationMethod) {
        this.calculationMethod = calculationMethod;
    }

    public String getDataStatus() {
        return dataStatus;
    }

    public void setDataStatus(String dataStatus) {
        this.dataStatus = dataStatus;
    }
}