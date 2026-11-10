
package com.landprofiling.backend.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "worksites")
public class Worksite {

    @Id
    @Column(name = "work_id", length = 20)
    private String workId;

    @Column(name = "work_name", nullable = false, length = 150)
    private String workName;

    @Column(name = "work_type", nullable = false,
        columnDefinition = "ENUM('LAND_LEVELLING','POND_EXCAVATION','FIELD_BUNDING','DRAINAGE','LAND_FILLING')")
    private String workType;

    private String village;

    @Column(name = "gram_panchayat")
    private String gramPanchayat;

    @Column(name = "block_name")
    private String blockName;

    @Column(name = "district_name")
    private String districtName;

    @Column(name = "state_name")
    private String stateName;

    @Column(name = "site_width_m")
    private BigDecimal siteWidthM;

    @Column(name = "site_length_m")
    private BigDecimal siteLengthM;

    @Column(name = "site_area_m2")
    private BigDecimal siteAreaM2;

    @Column(name = "reference_elevation_m")
    private BigDecimal referenceElevationM;

    @Column(name = "data_status")
    private String dataStatus;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public Worksite() {
    }

    // Getters and Setters

    public String getWorkId() {
        return workId;
    }

    public void setWorkId(String workId) {
        this.workId = workId;
    }

    public String getWorkName() {
        return workName;
    }

    public void setWorkName(String workName) {
        this.workName = workName;
    }

    public String getWorkType() {
        return workType;
    }

    public void setWorkType(String workType) {
        this.workType = workType;
    }

    public String getVillage() {
        return village;
    }

    public void setVillage(String village) {
        this.village = village;
    }

    public String getGramPanchayat() {
        return gramPanchayat;
    }

    public void setGramPanchayat(String gramPanchayat) {
        this.gramPanchayat = gramPanchayat;
    }

    public String getBlockName() {
        return blockName;
    }

    public void setBlockName(String blockName) {
        this.blockName = blockName;
    }

    public String getDistrictName() {
        return districtName;
    }

    public void setDistrictName(String districtName) {
        this.districtName = districtName;
    }

    public String getStateName() {
        return stateName;
    }

    public void setStateName(String stateName) {
        this.stateName = stateName;
    }

    public BigDecimal getSiteWidthM() {
        return siteWidthM;
    }

    public void setSiteWidthM(BigDecimal siteWidthM) {
        this.siteWidthM = siteWidthM;
    }

    public BigDecimal getSiteLengthM() {
        return siteLengthM;
    }

    public void setSiteLengthM(BigDecimal siteLengthM) {
        this.siteLengthM = siteLengthM;
    }

    public BigDecimal getSiteAreaM2() {
        return siteAreaM2;
    }

    public void setSiteAreaM2(BigDecimal siteAreaM2) {
        this.siteAreaM2 = siteAreaM2;
    }

    public BigDecimal getReferenceElevationM() {
        return referenceElevationM;
    }

    public void setReferenceElevationM(BigDecimal referenceElevationM) {
        this.referenceElevationM = referenceElevationM;
    }

    public String getDataStatus() {
        return dataStatus;
    }

    public void setDataStatus(String dataStatus) {
        this.dataStatus = dataStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
