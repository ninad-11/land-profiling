
package com.landprofiling.backend.entity;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "gcps")
public class Gcp {

    @Id
    @Column(name = "gcp_id", length = 30)
    private String gcpId;

    @Column(name = "work_id", nullable = false, length = 20)
    private String workId;

    @JsonProperty("xmLocal")
    @Column(name = "x_m_local", nullable = false,
            precision = 10, scale = 3)
    private BigDecimal xMLocal;

    @JsonProperty("ymLocal")
    @Column(name = "y_m_local", nullable = false,
            precision = 10, scale = 3)
    private BigDecimal yMLocal;

    @JsonProperty("zm")
    @Column(name = "z_m", nullable = false,
            precision = 10, scale = 4)
    private BigDecimal zM;

    @Column(name = "reference_type", nullable = false)
    private String referenceType;

    @Column(name = "data_status", nullable = false)
    private String dataStatus;

    public Gcp() {
    }

    public String getGcpId() {
        return gcpId;
    }

    public void setGcpId(String gcpId) {
        this.gcpId = gcpId;
    }

    public String getWorkId() {
        return workId;
    }

    public void setWorkId(String workId) {
        this.workId = workId;
    }

    @JsonProperty("xmLocal")
    public BigDecimal getXMLocal() {
        return xMLocal;
    }

    @JsonProperty("xmLocal")
    public void setXMLocal(BigDecimal xMLocal) {
        this.xMLocal = xMLocal;
    }

    @JsonProperty("ymLocal")
    public BigDecimal getYMLocal() {
        return yMLocal;
    }

    @JsonProperty("ymLocal")
    public void setYMLocal(BigDecimal yMLocal) {
        this.yMLocal = yMLocal;
    }

    @JsonProperty("zm")
    public BigDecimal getZM() {
        return zM;
    }

    @JsonProperty("zm")
    public void setZM(BigDecimal zM) {
        this.zM = zM;
    }

    public String getReferenceType() {
        return referenceType;
    }

    public void setReferenceType(String referenceType) {
        this.referenceType = referenceType;
    }

    public String getDataStatus() {
        return dataStatus;
    }

    public void setDataStatus(String dataStatus) {
        this.dataStatus = dataStatus;
    }
}
