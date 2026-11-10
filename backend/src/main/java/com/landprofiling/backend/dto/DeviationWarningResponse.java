
package com.landprofiling.backend.dto;

import java.math.BigDecimal;

public class DeviationWarningResponse {

    private String resultId;
    private String workId;

    private BigDecimal estimateDeviationPercent;
    private String estimateWarning;

    private BigDecimal mbDeviationPercent;
    private String mbWarning;

    private String overallWarning;

    public DeviationWarningResponse() {
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

    public BigDecimal getEstimateDeviationPercent() {
        return estimateDeviationPercent;
    }

    public void setEstimateDeviationPercent(
            BigDecimal estimateDeviationPercent) {
        this.estimateDeviationPercent = estimateDeviationPercent;
    }

    public String getEstimateWarning() {
        return estimateWarning;
    }

    public void setEstimateWarning(String estimateWarning) {
        this.estimateWarning = estimateWarning;
    }

    public BigDecimal getMbDeviationPercent() {
        return mbDeviationPercent;
    }

    public void setMbDeviationPercent(
            BigDecimal mbDeviationPercent) {
        this.mbDeviationPercent = mbDeviationPercent;
    }

    public String getMbWarning() {
        return mbWarning;
    }

    public void setMbWarning(String mbWarning) {
        this.mbWarning = mbWarning;
    }

    public String getOverallWarning() {
        return overallWarning;
    }

    public void setOverallWarning(String overallWarning) {
        this.overallWarning = overallWarning;
    }
}
