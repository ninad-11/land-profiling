# Land Profiling of Asset Creation Process

### 3D Terrain Profiling for MGNREGS Earthwork Sites

A web-based system for monitoring and analysing earthwork activities under the Mahatma Gandhi National Rural Employment Guarantee Scheme (MGNREGS) using PRE/POST terrain data, digital elevation models, 3D visualizations and earthwork quantity calculations.

> **Demo data disclaimer:** All currently included datasets, worksites, terrain models, survey records and images are SYNTHETIC / FICTIONAL. They are intended exclusively for development, testing and demonstration. They are not official MGNREGS records or actual field-survey evidence.

---

## 1. Project Overview

The project aims to develop a digital platform for profiling land and verifying asset creation through 3D terrain analysis.

It uses PRE-work and POST-work terrain information to analyse changes in land elevation, estimate cut-and-fill quantities, visualize terrain differences and compare calculated quantities with estimated and Measurement Book (MB) quantities.

The system combines a web application, REST APIs, a relational database and a Python-based terrain-processing service.

## 2. Key Features

- Worksite management and monitoring.
- PRE-work and POST-work survey management.
- Ground Control Point (GCP) and reference-point management.
- Survey image upload and management.
- Earthwork estimate and Measurement Book record management.
- Digital Elevation Model (DEM) processing.
- Terrain comparison and elevation-difference analysis.
- Cut-and-fill volume calculation.
- Interactive 3D terrain visualization.
- Contour map generation.
- Comparison of calculated, estimated and recorded quantities.
- Deviation warnings and result validation.
- Dashboard for viewing project information and analysis results.

## 3. System Workflow

1. Register and select an earthwork worksite.
2. Record the worksite reference points and benchmark information.
3. Upload or provide PRE-work survey data.
4. Generate or provide the PRE-work terrain model.
5. Execute the earthwork activity.
6. Upload or provide POST-work survey data.
7. Generate or provide the POST-work terrain model.
8. Process both terrain models and calculate elevation differences.
9. Calculate cut-and-fill quantities.
10. Compare calculated quantities with estimate and Measurement Book records.
11. Display terrain visualizations, warnings and validation results.

## 4. Technology Stack

| Component | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript, CSS |
| Backend | Java 21, Spring Boot, Spring Data JPA |
| Database | MySQL |
| Terrain Processing | Python 3.11, FastAPI, NumPy, Rasterio, SciPy |
| Visualization | Matplotlib, Plotly |
| API Communication | REST APIs, HTTP |
| Build Tools | Maven, npm |
| Version Control | Git, GitHub |

## 5. Project Architecture

The application is divided into three main components.

### Frontend
The React application provides the user interface for:
- Dashboard
- Worksites
- Surveys
- GCPs
- Estimates
- Measurement Records
- Terrain Analysis
- Earthwork Results
- Warnings
- Validations

### Backend
The Spring Boot application manages:
- REST API endpoints
- Worksite and survey records
- GCP management
- Estimate and Measurement Book records
- Earthwork results
- Validation and warning records
- Image storage
- Communication with the Python processing service

### Terrain Processing Service
The Python FastAPI application performs:
- DEM loading and processing
- PRE/POST terrain comparison
- Elevation-difference analysis
- Cut-and-fill volume calculations
- Contour generation
- 2D and interactive 3D visualization

## 6. Repository Structure

```text
land_profiling/
│
├── backend/                 # Spring Boot REST API
│   └── src/
│
├── frontend/                # React web application
│   └── src/
│
├── processing/              # Python terrain processing
│   ├── app/
│   ├── data/                # Synthetic DEM inputs
│   └── requirements.txt
│
├── data/                    # Synthetic datasets and metadata
│
├── scripts/                 # Synthetic terrain data generation
│
├── sql/                     # Database schema and seed scripts
│
├── terrain/                 # Sample DEM and point-cloud files
│
├── test/                    # Synthetic PRE/POST test images
│
├── visualizations/          # Sample terrain visualizations
│
├── .gitignore
└── README.md
```

## 7. Setup and Installation

### Prerequisites

Install the following software:

- Java JDK 21
- MySQL Server and MySQL Workbench
- Python 3.11
- Node.js and npm
- Git

### Step 1: Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd land_profiling
```

### Step 2: Configure the database

1. Start MySQL Server.
2. Open MySQL Workbench.
3. Execute:

```text
sql/land_profiling_database.sql
```

This creates and populates the `land_profiling` database with synthetic demonstration records.

**Important:** The main SQL script drops and recreates tables inside the database. Back up existing data before executing it again.

### Step 3: Configure and run the backend

Navigate to the backend directory:

```bash
cd backend
```

Configure your MySQL credentials using the `DB_PASSWORD` environment variable.

The default database connection is configured in:

```text
backend/src/main/resources/application.properties
```

Return to the project root after configuration and start the backend:

```bash
cd ..
cd backend
mvnw.cmd spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

### Step 4: Configure and run the Python processing service

Open another terminal and navigate to the processing directory:

```bash
cd processing
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI service:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The processing service runs on:

```text
http://127.0.0.1:8000
```

### Step 5: Configure and run the frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in the terminal, usually:

```text
http://localhost:5173
```

## 8. Sample Terrain Data

The repository contains synthetic terrain data for demonstration and testing.

### Data Directory

- `site_metadata.json` – Worksite metadata.
- `surveys.csv` – Sample survey records.
- `synthetic_gcps.csv` – Synthetic reference-point information.
- `synthetic_estimate.csv` – Sample estimated quantities.
- `synthetic_mb_quantity.csv` – Sample Measurement Book quantities.
- `synthetic_earthwork_results.csv` – Demonstration earthwork results.
- `synthetic_terrain_points.csv` – Synthetic terrain point data.
- `SUMMARY.txt` – Dataset description.

### Terrain Directory

- `dem_before.asc`
- `dem_after.asc`
- `surface_difference.asc`
- `pointcloud_before.ply`
- `pointcloud_after.ply`

The sample terrain files represent the first demonstration worksite, `LP-2026-001`. The remaining database worksites are sample records and do not currently have separate terrain models.

The DEM files in `processing/data/` are also synthetic inputs used by the processing service.

## 9. Terrain Calculation and Data Limitations

The current implementation uses simplified synthetic terrain data.

- Local X/Y coordinates are expressed in metres and are not GPS coordinates or latitude/longitude.
- Synthetic GCPs are local reference points, not actual surveyed GCPs.
- Point clouds are generated from synthetic elevation grids, not reconstructed from photographs.
- Cut and fill are calculated from differences between the before-and-after elevation grids.
- Total cut plus fill is used as the illustrative total earth-moved quantity.
- Net cut is calculated as cut minus fill and represents a different measurement.
- The current volume calculation uses a simplified grid-node summation. It is not an engineering-grade cell-based volume calculation.

**These calculations must not be used for official MGNREGS audits, payments, certification or government reporting.**

Actual deployment requires properly surveyed elevation data, appropriate coordinate reference systems, validated GCPs and reliable photogrammetric or survey-based terrain reconstruction.

## 10. Future Scope

- Integration with OpenDroneMap for photogrammetric 3D reconstruction.
- Processing of actual overlapping drone photographs.
- Integration with GNSS/RTK-based GCP measurements.
- Improved DEM/DTM generation and accuracy assessment.
- Engineering-grade cut-and-fill volume calculations.
- Advanced GIS-based terrain analysis.
- Enhanced audit reports and verification workflows.
- Deployment on a cloud platform.

## 11. Project Status

The current demonstration implementation includes:

- React-based frontend.
- Spring Boot backend and REST APIs.
- MySQL database integration.
- Python-based terrain-processing service.
- Synthetic DEM comparison.
- Cut-and-fill analysis.
- 2D and interactive 3D visualizations.
- Contour generation.
- Estimate and Measurement Book comparison.
- Deviation warnings and validation functionality.

Photogrammetric reconstruction from actual survey photographs and field-data validation remain future development areas.

---

## Disclaimer

This project is developed for academic and demonstration purposes. All included sample data are synthetic. The current results do not represent verified measurements of actual MGNREGS worksites.
