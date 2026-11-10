package com.landprofiling.backend.dto;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import tools.jackson.databind.PropertyNamingStrategies;
import tools.jackson.databind.annotation.JsonNaming;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class TerrainAnalysisResponse {

    private String status;
    private String dataStatus;

    private Integer rows;
    private Integer columns;
    private Integer validPixels;

    private BigDecimal pixelAreaM2;
    private String coordinateReference;

    private BigDecimal cutVolumeM3;
    private BigDecimal fillVolumeM3;
    private BigDecimal netCutVolumeM3;

    // Visualization information
    private String analysisId;
    private Visualizations visualizations;

    public TerrainAnalysisResponse() {
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDataStatus() {
        return dataStatus;
    }

    public void setDataStatus(String dataStatus) {
        this.dataStatus = dataStatus;
    }

    public Integer getRows() {
        return rows;
    }

    public void setRows(Integer rows) {
        this.rows = rows;
    }

    public Integer getColumns() {
        return columns;
    }

    public void setColumns(Integer columns) {
        this.columns = columns;
    }

    public Integer getValidPixels() {
        return validPixels;
    }

    public void setValidPixels(Integer validPixels) {
        this.validPixels = validPixels;
    }

    public BigDecimal getPixelAreaM2() {
        return pixelAreaM2;
    }

    public void setPixelAreaM2(BigDecimal pixelAreaM2) {
        this.pixelAreaM2 = pixelAreaM2;
    }

    public String getCoordinateReference() {
        return coordinateReference;
    }

    public void setCoordinateReference(String coordinateReference) {
        this.coordinateReference = coordinateReference;
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

    public String getAnalysisId() {
        return analysisId;
    }

    public void setAnalysisId(String analysisId) {
        this.analysisId = analysisId;
    }

    public Visualizations getVisualizations() {
        return visualizations;
    }

    public void setVisualizations(Visualizations visualizations) {
        this.visualizations = visualizations;
    }

    // Nested class for visualization URLs
    
    public static class Visualizations {

        @JsonProperty("terrain_2d")
        private String terrain2d;

        @JsonProperty("terrain_3d_comparison")
        private String terrain3dComparison;

        @JsonProperty("terrain_3d_difference")
        private String terrain3dDifference;

        @JsonProperty("contour_comparison")
        private String contourComparison;

        public String getTerrain2d() {
            return terrain2d;
        }

        public void setTerrain2d(String terrain2d) {
            this.terrain2d = terrain2d;
        }

        public String getTerrain3dComparison() {
            return terrain3dComparison;
        }

        public void setTerrain3dComparison(String terrain3dComparison) {
            this.terrain3dComparison = terrain3dComparison;
        }

        public String getTerrain3dDifference() {
            return terrain3dDifference;
        }

        public void setTerrain3dDifference(String terrain3dDifference) {
            this.terrain3dDifference = terrain3dDifference;
        }

        public String getContourComparison() {
            return contourComparison;
        }

        public void setContourComparison(String contourComparison) {
            this.contourComparison = contourComparison;
        }
    }
}
