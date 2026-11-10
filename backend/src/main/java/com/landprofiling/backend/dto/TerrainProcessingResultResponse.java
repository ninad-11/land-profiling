
package com.landprofiling.backend.dto;

import com.landprofiling.backend.entity.EarthworkResult;

public class TerrainProcessingResultResponse {

    private EarthworkResult result;
    private String analysisId;
    private String dataStatus;
    private Visualizations visualizations;

    public TerrainProcessingResultResponse() {
    }

    public TerrainProcessingResultResponse(
            EarthworkResult result,
            String analysisId,
            String dataStatus,
            Visualizations visualizations) {

        this.result = result;
        this.analysisId = analysisId;
        this.dataStatus = dataStatus;
        this.visualizations = visualizations;
    }

    public EarthworkResult getResult() {
        return result;
    }

    public void setResult(EarthworkResult result) {
        this.result = result;
    }

    public String getAnalysisId() {
        return analysisId;
    }

    public void setAnalysisId(String analysisId) {
        this.analysisId = analysisId;
    }

    public String getDataStatus() {
        return dataStatus;
    }

    public void setDataStatus(String dataStatus) {
        this.dataStatus = dataStatus;
    }

    public Visualizations getVisualizations() {
        return visualizations;
    }

    public void setVisualizations(Visualizations visualizations) {
        this.visualizations = visualizations;
    }

    public static class Visualizations {

        private String terrain2d;
        private String terrain3dComparison;
        private String terrain3dDifference;
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
