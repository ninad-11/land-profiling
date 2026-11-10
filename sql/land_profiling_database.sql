-- Land Profiling of Asset Creation Process
-- DEMONSTRATION DATA: fictional sample records for development/testing.
-- MySQL 8.0+
-- Creates a NEW database named land_profiling (no "synthetic" in the name).
-- This script does not delete or modify the earlier land_profiling_synthetic database.

CREATE DATABASE IF NOT EXISTS land_profiling
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE land_profiling;

-- Drop child tables first so this script can be safely rerun.
DROP TABLE IF EXISTS earthwork_results;
DROP TABLE IF EXISTS measurement_records;
DROP TABLE IF EXISTS earthwork_estimates;
DROP TABLE IF EXISTS gcps;
DROP TABLE IF EXISTS surveys;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS worksites;

CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  role ENUM('TECHNICAL_STAFF','ENGINEER','AUDITOR','ADMIN') NOT NULL,
  email VARCHAR(150) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE worksites (
  work_id VARCHAR(20) PRIMARY KEY,
  work_name VARCHAR(150) NOT NULL,
  work_type ENUM('LAND_LEVELLING','POND_EXCAVATION','FIELD_BUNDING','DRAINAGE','LAND_FILLING') NOT NULL,
  village VARCHAR(100) NOT NULL,
  gram_panchayat VARCHAR(120) NOT NULL,
  block_name VARCHAR(100) NOT NULL,
  district_name VARCHAR(100) NOT NULL,
  state_name VARCHAR(100) NOT NULL,
  site_width_m DECIMAL(8,2) NOT NULL,
  site_length_m DECIMAL(8,2) NOT NULL,
  site_area_m2 DECIMAL(10,2) NOT NULL,
  reference_elevation_m DECIMAL(10,3),
  data_status VARCHAR(50) NOT NULL DEFAULT 'DEMO DATA — VERIFY BEFORE REAL USE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE surveys (
  survey_id VARCHAR(30) PRIMARY KEY,
  work_id VARCHAR(20) NOT NULL,
  survey_type ENUM('PRE','POST') NOT NULL,
  survey_date DATE NOT NULL,
  terrain_file VARCHAR(255),
  image_folder VARCHAR(255),
  notes TEXT,
  data_status VARCHAR(50) NOT NULL DEFAULT 'DEMO',
  CONSTRAINT fk_surveys_worksite FOREIGN KEY (work_id)
    REFERENCES worksites(work_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE gcps (
  gcp_id VARCHAR(30) PRIMARY KEY,
  work_id VARCHAR(20) NOT NULL,
  x_m_local DECIMAL(10,3) NOT NULL,
  y_m_local DECIMAL(10,3) NOT NULL,
  z_m DECIMAL(10,4) NOT NULL,
  reference_type VARCHAR(100) NOT NULL DEFAULT 'Local demo reference point',
  data_status VARCHAR(50) NOT NULL DEFAULT 'DEMO',
  CONSTRAINT fk_gcps_worksite FOREIGN KEY (work_id)
    REFERENCES worksites(work_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE earthwork_estimates (
  estimate_id VARCHAR(30) PRIMARY KEY,
  work_id VARCHAR(20) NOT NULL,
  estimated_quantity_m3 DECIMAL(12,3) NOT NULL,
  estimate_date DATE,
  quantity_basis VARCHAR(200),
  data_status VARCHAR(50) NOT NULL DEFAULT 'DEMO',
  CONSTRAINT fk_estimate_worksite FOREIGN KEY (work_id)
    REFERENCES worksites(work_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE measurement_records (
  measurement_id VARCHAR(30) PRIMARY KEY,
  work_id VARCHAR(20) NOT NULL,
  recorded_quantity_m3 DECIMAL(12,3) NOT NULL,
  measurement_date DATE,
  quantity_basis VARCHAR(200),
  data_status VARCHAR(50) NOT NULL DEFAULT 'DEMO',
  CONSTRAINT fk_measurement_worksite FOREIGN KEY (work_id)
    REFERENCES worksites(work_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE earthwork_results (
  result_id VARCHAR(30) PRIMARY KEY,
  work_id VARCHAR(20) NOT NULL,
  cut_volume_m3 DECIMAL(12,3) NOT NULL,
  fill_volume_m3 DECIMAL(12,3) NOT NULL,
  net_cut_volume_m3 DECIMAL(12,3) NOT NULL,
  estimated_quantity_m3 DECIMAL(12,3),
  recorded_quantity_m3 DECIMAL(12,3),
  absolute_difference_m3 DECIMAL(12,3),
  difference_percent DECIMAL(8,3),
  calculation_method VARCHAR(255),
  data_status VARCHAR(80) NOT NULL DEFAULT 'DEMO — NOT VALIDATED',
  CONSTRAINT fk_result_worksite FOREIGN KEY (work_id)
    REFERENCES worksites(work_id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Optional demonstration users. These are fictional names and non-functional example emails.
INSERT INTO users (full_name, role, email) VALUES
('Demo Technical Staff','TECHNICAL_STAFF','tech.demo@example.invalid'),
('Demo Engineer','ENGINEER','engineer.demo@example.invalid'),
('Demo Auditor','AUDITOR','auditor.demo@example.invalid'),
('Demo Administrator','ADMIN','admin.demo@example.invalid');

-- 12 fictional worksites. Names, places, dates, quantities and reference elevations are invented.
INSERT INTO worksites
(work_id, work_name, work_type, village, gram_panchayat, block_name, district_name, state_name,
 site_width_m, site_length_m, site_area_m2, reference_elevation_m, data_status)
VALUES
('LP-2026-001','Demonstration Land Levelling 01','LAND_LEVELLING','Samplepur','Demo Panchayat 01','Example Block A','Example District A','Madhya Pradesh',20,20,400,100.000,'DEMO / FICTIONAL'),
('LP-2026-002','Demonstration Land Levelling 02','LAND_LEVELLING','Testgaon','Demo Panchayat 02','Example Block A','Example District A','Madhya Pradesh',25,20,500,101.200,'DEMO / FICTIONAL'),
('LP-2026-003','Demonstration Land Levelling 03','LAND_LEVELLING','Modelkheda','Demo Panchayat 03','Example Block B','Example District A','Madhya Pradesh',18,15,270,99.850,'DEMO / FICTIONAL'),
('LP-2026-004','Demonstration Land Levelling 04','LAND_LEVELLING','Examplewadi','Demo Panchayat 04','Example Block B','Example District B','Madhya Pradesh',30,20,600,102.000,'DEMO / FICTIONAL'),
('LP-2026-005','Demonstration Land Levelling 05','LAND_LEVELLING','Practicenagar','Demo Panchayat 05','Example Block C','Example District B','Madhya Pradesh',22,18,396,100.450,'DEMO / FICTIONAL'),
('LP-2026-006','Demonstration Land Levelling 06','LAND_LEVELLING','Learningpur','Demo Panchayat 06','Example Block C','Example District C','Madhya Pradesh',16,16,256,98.900,'DEMO / FICTIONAL'),
('LP-2026-007','Demonstration Land Levelling 07','LAND_LEVELLING','Samplewadi','Demo Panchayat 07','Example Block D','Example District C','Madhya Pradesh',24,22,528,101.050,'DEMO / FICTIONAL'),
('LP-2026-008','Demonstration Land Levelling 08','LAND_LEVELLING','Demo Nagar','Demo Panchayat 08','Example Block D','Example District D','Madhya Pradesh',28,20,560,103.300,'DEMO / FICTIONAL'),
('LP-2026-009','Demonstration Land Levelling 09','LAND_LEVELLING','Terrainpur','Demo Panchayat 09','Example Block E','Example District D','Madhya Pradesh',20,18,360,100.700,'DEMO / FICTIONAL'),
('LP-2026-010','Demonstration Land Levelling 10','LAND_LEVELLING','Modelpur','Demo Panchayat 10','Example Block E','Example District E','Madhya Pradesh',26,20,520,99.600,'DEMO / FICTIONAL'),
('LP-2026-011','Demonstration Land Levelling 11','LAND_LEVELLING','Trialkheda','Demo Panchayat 11','Example Block F','Example District E','Madhya Pradesh',15,14,210,98.750,'DEMO / FICTIONAL'),
('LP-2026-012','Demonstration Land Levelling 12','LAND_LEVELLING','Demo Kalan','Demo Panchayat 12','Example Block F','Example District F','Madhya Pradesh',32,24,768,104.100,'DEMO / FICTIONAL');

-- Two survey records per site (PRE and POST).
INSERT INTO surveys
(survey_id, work_id, survey_type, survey_date, terrain_file, image_folder, notes, data_status)
VALUES
('SUR-001-PRE','LP-2026-001','PRE','2026-09-01','terrain/dem_before.asc','data/images/site001/pre','Fictional pre-work survey','DEMO'),
('SUR-001-POST','LP-2026-001','POST','2026-09-15','terrain/dem_after.asc','data/images/site001/post','Fictional post-work survey','DEMO'),
('SUR-002-PRE','LP-2026-002','PRE','2026-09-02','terrain/site002_before.asc','data/images/site002/pre','Fictional pre-work survey','DEMO'),
('SUR-002-POST','LP-2026-002','POST','2026-09-16','terrain/site002_after.asc','data/images/site002/post','Fictional post-work survey','DEMO'),
('SUR-003-PRE','LP-2026-003','PRE','2026-09-03','terrain/site003_before.asc','data/images/site003/pre','Fictional pre-work survey','DEMO'),
('SUR-003-POST','LP-2026-003','POST','2026-09-17','terrain/site003_after.asc','data/images/site003/post','Fictional post-work survey','DEMO'),
('SUR-004-PRE','LP-2026-004','PRE','2026-09-04','terrain/site004_before.asc','data/images/site004/pre','Fictional pre-work survey','DEMO'),
('SUR-004-POST','LP-2026-004','POST','2026-09-18','terrain/site004_after.asc','data/images/site004/post','Fictional post-work survey','DEMO'),
('SUR-005-PRE','LP-2026-005','PRE','2026-09-05','terrain/site005_before.asc','data/images/site005/pre','Fictional pre-work survey','DEMO'),
('SUR-005-POST','LP-2026-005','POST','2026-09-19','terrain/site005_after.asc','data/images/site005/post','Fictional post-work survey','DEMO'),
('SUR-006-PRE','LP-2026-006','PRE','2026-09-06','terrain/site006_before.asc','data/images/site006/pre','Fictional pre-work survey','DEMO'),
('SUR-006-POST','LP-2026-006','POST','2026-09-20','terrain/site006_after.asc','data/images/site006/post','Fictional post-work survey','DEMO'),
('SUR-007-PRE','LP-2026-007','PRE','2026-09-07','terrain/site007_before.asc','data/images/site007/pre','Fictional pre-work survey','DEMO'),
('SUR-007-POST','LP-2026-007','POST','2026-09-21','terrain/site007_after.asc','data/images/site007/post','Fictional post-work survey','DEMO'),
('SUR-008-PRE','LP-2026-008','PRE','2026-09-08','terrain/site008_before.asc','data/images/site008/pre','Fictional pre-work survey','DEMO'),
('SUR-008-POST','LP-2026-008','POST','2026-09-22','terrain/site008_after.asc','data/images/site008/post','Fictional post-work survey','DEMO'),
('SUR-009-PRE','LP-2026-009','PRE','2026-09-09','terrain/site009_before.asc','data/images/site009/pre','Fictional pre-work survey','DEMO'),
('SUR-009-POST','LP-2026-009','POST','2026-09-23','terrain/site009_after.asc','data/images/site009/post','Fictional post-work survey','DEMO'),
('SUR-010-PRE','LP-2026-010','PRE','2026-09-10','terrain/site010_before.asc','data/images/site010/pre','Fictional pre-work survey','DEMO'),
('SUR-010-POST','LP-2026-010','POST','2026-09-24','terrain/site010_after.asc','data/images/site010/post','Fictional post-work survey','DEMO'),
('SUR-011-PRE','LP-2026-011','PRE','2026-09-11','terrain/site011_before.asc','data/images/site011/pre','Fictional pre-work survey','DEMO'),
('SUR-011-POST','LP-2026-011','POST','2026-09-25','terrain/site011_after.asc','data/images/site011/post','Fictional post-work survey','DEMO'),
('SUR-012-PRE','LP-2026-012','PRE','2026-09-12','terrain/site012_before.asc','data/images/site012/pre','Fictional pre-work survey','DEMO'),
('SUR-012-POST','LP-2026-012','POST','2026-09-26','terrain/site012_after.asc','data/images/site012/post','Fictional post-work survey','DEMO');

-- Five fictional local reference points per site; these are NOT GPS coordinates.
INSERT INTO gcps (gcp_id,work_id,x_m_local,y_m_local,z_m,reference_type,data_status) VALUES
('GCP-001-01','LP-2026-001',0.000,0.000,100.0350,'Fictional local reference point','DEMO'),
('GCP-001-02','LP-2026-001',20.000,0.000,100.4650,'Fictional local reference point','DEMO'),
('GCP-001-03','LP-2026-001',0.000,20.000,99.8950,'Fictional local reference point','DEMO'),
('GCP-001-04','LP-2026-001',20.000,20.000,100.3250,'Fictional local reference point','DEMO'),
('GCP-001-05','LP-2026-001',10.000,10.000,100.2550,'Fictional local reference point','DEMO'),
('GCP-002-01','LP-2026-002',0.000,0.000,101.2400,'Fictional local reference point','DEMO'),
('GCP-002-02','LP-2026-002',25.000,0.000,101.7700,'Fictional local reference point','DEMO'),
('GCP-002-03','LP-2026-002',0.000,20.000,101.1000,'Fictional local reference point','DEMO'),
('GCP-002-04','LP-2026-002',25.000,20.000,101.6300,'Fictional local reference point','DEMO'),
('GCP-002-05','LP-2026-002',12.500,10.000,101.5100,'Fictional local reference point','DEMO'),
('GCP-003-01','LP-2026-003',0.000,0.000,99.8950,'Fictional local reference point','DEMO'),
('GCP-003-02','LP-2026-003',18.000,0.000,100.2850,'Fictional local reference point','DEMO'),
('GCP-003-03','LP-2026-003',0.000,15.000,99.8050,'Fictional local reference point','DEMO'),
('GCP-003-04','LP-2026-003',18.000,15.000,100.1950,'Fictional local reference point','DEMO'),
('GCP-003-05','LP-2026-003',9.000,7.500,100.1200,'Fictional local reference point','DEMO'),
('GCP-004-01','LP-2026-004',0.000,0.000,102.0500,'Fictional local reference point','DEMO'),
('GCP-004-02','LP-2026-004',30.000,0.000,102.6800,'Fictional local reference point','DEMO'),
('GCP-004-03','LP-2026-004',0.000,20.000,101.9100,'Fictional local reference point','DEMO'),
('GCP-004-04','LP-2026-004',30.000,20.000,102.5400,'Fictional local reference point','DEMO'),
('GCP-004-05','LP-2026-004',15.000,10.000,102.3700,'Fictional local reference point','DEMO'),
('GCP-005-01','LP-2026-005',0.000,0.000,100.5050,'Fictional local reference point','DEMO'),
('GCP-005-02','LP-2026-005',22.000,0.000,100.9750,'Fictional local reference point','DEMO'),
('GCP-005-03','LP-2026-005',0.000,18.000,100.3850,'Fictional local reference point','DEMO'),
('GCP-005-04','LP-2026-005',22.000,18.000,100.8550,'Fictional local reference point','DEMO'),
('GCP-005-05','LP-2026-005',11.000,9.000,100.7550,'Fictional local reference point','DEMO'),
('GCP-006-01','LP-2026-006',0.000,0.000,98.9600,'Fictional local reference point','DEMO'),
('GCP-006-02','LP-2026-006',16.000,0.000,99.3100,'Fictional local reference point','DEMO'),
('GCP-006-03','LP-2026-006',0.000,16.000,98.8600,'Fictional local reference point','DEMO'),
('GCP-006-04','LP-2026-006',16.000,16.000,99.2100,'Fictional local reference point','DEMO'),
('GCP-006-05','LP-2026-006',8.000,8.000,99.1600,'Fictional local reference point','DEMO'),
('GCP-007-01','LP-2026-007',0.000,0.000,101.1150,'Fictional local reference point','DEMO'),
('GCP-007-02','LP-2026-007',24.000,0.000,101.6250,'Fictional local reference point','DEMO'),
('GCP-007-03','LP-2026-007',0.000,22.000,100.9550,'Fictional local reference point','DEMO'),
('GCP-007-04','LP-2026-007',24.000,22.000,101.4650,'Fictional local reference point','DEMO'),
('GCP-007-05','LP-2026-007',12.000,11.000,101.3650,'Fictional local reference point','DEMO'),
('GCP-008-01','LP-2026-008',0.000,0.000,103.3700,'Fictional local reference point','DEMO'),
('GCP-008-02','LP-2026-008',28.000,0.000,103.9600,'Fictional local reference point','DEMO'),
('GCP-008-03','LP-2026-008',0.000,20.000,103.2300,'Fictional local reference point','DEMO'),
('GCP-008-04','LP-2026-008',28.000,20.000,103.8200,'Fictional local reference point','DEMO'),
('GCP-008-05','LP-2026-008',14.000,10.000,103.6700,'Fictional local reference point','DEMO'),
('GCP-009-01','LP-2026-009',0.000,0.000,100.7750,'Fictional local reference point','DEMO'),
('GCP-009-02','LP-2026-009',20.000,0.000,101.2050,'Fictional local reference point','DEMO'),
('GCP-009-03','LP-2026-009',0.000,18.000,100.6550,'Fictional local reference point','DEMO'),
('GCP-009-04','LP-2026-009',20.000,18.000,101.0850,'Fictional local reference point','DEMO'),
('GCP-009-05','LP-2026-009',10.000,9.000,101.0050,'Fictional local reference point','DEMO'),
('GCP-010-01','LP-2026-010',0.000,0.000,99.6800,'Fictional local reference point','DEMO'),
('GCP-010-02','LP-2026-010',26.000,0.000,100.2300,'Fictional local reference point','DEMO'),
('GCP-010-03','LP-2026-010',0.000,20.000,99.5400,'Fictional local reference point','DEMO'),
('GCP-010-04','LP-2026-010',26.000,20.000,100.0900,'Fictional local reference point','DEMO'),
('GCP-010-05','LP-2026-010',13.000,10.000,99.9600,'Fictional local reference point','DEMO'),
('GCP-011-01','LP-2026-011',0.000,0.000,98.8350,'Fictional local reference point','DEMO'),
('GCP-011-02','LP-2026-011',15.000,0.000,99.1650,'Fictional local reference point','DEMO'),
('GCP-011-03','LP-2026-011',0.000,14.000,98.7550,'Fictional local reference point','DEMO'),
('GCP-011-04','LP-2026-011',15.000,14.000,99.0850,'Fictional local reference point','DEMO'),
('GCP-011-05','LP-2026-011',7.500,7.000,99.0350,'Fictional local reference point','DEMO'),
('GCP-012-01','LP-2026-012',0.000,0.000,104.1900,'Fictional local reference point','DEMO'),
('GCP-012-02','LP-2026-012',32.000,0.000,104.8600,'Fictional local reference point','DEMO'),
('GCP-012-03','LP-2026-012',0.000,24.000,104.0100,'Fictional local reference point','DEMO'),
('GCP-012-04','LP-2026-012',32.000,24.000,104.6800,'Fictional local reference point','DEMO'),
('GCP-012-05','LP-2026-012',16.000,12.000,104.5100,'Fictional local reference point','DEMO');

INSERT INTO earthwork_estimates (estimate_id,work_id,estimated_quantity_m3,estimate_date,quantity_basis,data_status) VALUES
('EST-001','LP-2026-001',47.210,'2026-08-11','Fictional estimate for total cut + fill demonstration','DEMO'),
('EST-002','LP-2026-002',93.400,'2026-08-12','Fictional estimate quantity','DEMO'),
('EST-003','LP-2026-003',53.700,'2026-08-13','Fictional estimate quantity','DEMO'),
('EST-004','LP-2026-004',114.800,'2026-08-14','Fictional estimate quantity','DEMO'),
('EST-005','LP-2026-005',79.780,'2026-08-15','Fictional estimate quantity','DEMO'),
('EST-006','LP-2026-006',56.280,'2026-08-16','Fictional estimate quantity','DEMO'),
('EST-007','LP-2026-007',106.940,'2026-08-17','Fictional estimate quantity','DEMO'),
('EST-008','LP-2026-008',114.400,'2026-08-18','Fictional estimate quantity','DEMO'),
('EST-009','LP-2026-009',80.100,'2026-08-19','Fictional estimate quantity','DEMO'),
('EST-010','LP-2026-010',110.600,'2026-08-20','Fictional estimate quantity','DEMO'),
('EST-011','LP-2026-011',56.500,'2026-08-21','Fictional estimate quantity','DEMO'),
('EST-012','LP-2026-012',158.640,'2026-08-22','Fictional estimate quantity','DEMO');

INSERT INTO measurement_records (measurement_id,work_id,recorded_quantity_m3,measurement_date,quantity_basis,data_status) VALUES
('MB-001','LP-2026-001',43.710,'2026-09-11','Fictional sample quantity for total cut + fill; not an official Measurement Book','DEMO'),
('MB-002','LP-2026-002',90.598,'2026-09-12','Fictional sample quantity; not an official Measurement Book','DEMO'),
('MB-003','LP-2026-003',53.432,'2026-09-13','Fictional sample quantity; not an official Measurement Book','DEMO'),
('MB-004','LP-2026-004',105.616,'2026-09-14','Fictional sample quantity; not an official Measurement Book','DEMO'),
('MB-005','LP-2026-005',75.392,'2026-09-15','Fictional sample quantity; not an official Measurement Book','DEMO'),
('MB-006','LP-2026-006',54.592,'2026-09-16','Fictional sample quantity; not an official Measurement Book','DEMO'),
('MB-007','LP-2026-007',106.405,'2026-09-17','Fictional sample quantity; not an official Measurement Book','DEMO'),
('MB-008','LP-2026-008',105.248,'2026-09-18','Fictional sample quantity; not an official Measurement Book','DEMO'),
('MB-009','LP-2026-009',75.695,'2026-09-19','Fictional sample quantity; not an official Measurement Book','DEMO'),
('MB-010','LP-2026-010',107.282,'2026-09-20','Fictional sample quantity; not an official Measurement Book','DEMO'),
('MB-011','LP-2026-011',56.218,'2026-09-21','Fictional sample quantity; not an official Measurement Book','DEMO'),
('MB-012','LP-2026-012',145.949,'2026-09-22','Fictional sample quantity; not an official Measurement Book','DEMO');

INSERT INTO earthwork_results (result_id,work_id,cut_volume_m3,fill_volume_m3,net_cut_volume_m3,estimated_quantity_m3,recorded_quantity_m3,absolute_difference_m3,difference_percent,calculation_method,data_status) VALUES
('RES-001','LP-2026-001',25.618,18.096,7.523,47.210,43.710,0.004,0.009,'Terrain grid demonstration; comparison uses total cut + fill against sample quantity','DEMO — SYNTHETIC TERRAIN'),
('RES-002','LP-2026-002',70.666,10.872,59.794,93.400,90.598,30.804,34.001,'Illustrative demo calculation; not a validated survey result','DEMO — NOT VALIDATED'),
('RES-003','LP-2026-003',41.677,6.412,35.265,53.700,53.432,18.167,34.000,'Illustrative demo calculation; not a validated survey result','DEMO — NOT VALIDATED'),
('RES-004','LP-2026-004',82.380,12.674,69.706,114.800,105.616,35.910,34.001,'Illustrative demo calculation; not a validated survey result','DEMO — NOT VALIDATED'),
('RES-005','LP-2026-005',58.806,9.047,49.759,79.780,75.392,25.633,34.000,'Illustrative demo calculation; not a validated survey result','DEMO — NOT VALIDATED'),
('RES-006','LP-2026-006',42.582,6.551,36.031,56.280,54.592,18.561,33.999,'Illustrative demo calculation; not a validated survey result','DEMO — NOT VALIDATED'),
('RES-007','LP-2026-007',82.996,12.769,70.227,106.940,106.405,36.178,34.000,'Illustrative demo calculation; not a validated survey result','DEMO — NOT VALIDATED'),
('RES-008','LP-2026-008',82.093,12.630,69.463,114.400,105.248,35.785,34.001,'Illustrative demo calculation; not a validated survey result','DEMO — NOT VALIDATED'),
('RES-009','LP-2026-009',59.042,9.083,49.959,80.100,75.695,25.736,34.000,'Illustrative demo calculation; not a validated survey result','DEMO — NOT VALIDATED'),
('RES-010','LP-2026-010',83.680,12.874,70.806,110.600,107.282,36.476,34.000,'Illustrative demo calculation; not a validated survey result','DEMO — NOT VALIDATED'),
('RES-011','LP-2026-011',43.850,6.746,37.104,56.500,56.218,19.114,34.000,'Illustrative demo calculation; not a validated survey result','DEMO — NOT VALIDATED'),
('RES-012','LP-2026-012',113.840,17.514,96.326,158.640,145.949,49.623,34.000,'Illustrative demo calculation; not a validated survey result','DEMO — NOT VALIDATED');

-- Verify record counts.
SELECT 'worksites' AS table_name, COUNT(*) AS total_records FROM worksites
UNION ALL SELECT 'surveys', COUNT(*) FROM surveys
UNION ALL SELECT 'gcps', COUNT(*) FROM gcps
UNION ALL SELECT 'earthwork_estimates', COUNT(*) FROM earthwork_estimates
UNION ALL SELECT 'measurement_records', COUNT(*) FROM measurement_records
UNION ALL SELECT 'earthwork_results', COUNT(*) FROM earthwork_results
UNION ALL SELECT 'users', COUNT(*) FROM users;

-- View all worksites with their estimates and results.
SELECT w.work_id, w.work_name, w.village, w.site_area_m2,
       e.estimated_quantity_m3, m.recorded_quantity_m3,
       r.cut_volume_m3, r.fill_volume_m3, r.net_cut_volume_m3,
       r.absolute_difference_m3, w.data_status
FROM worksites w
LEFT JOIN earthwork_estimates e ON e.work_id = w.work_id
LEFT JOIN measurement_records m ON m.work_id = w.work_id
LEFT JOIN earthwork_results r ON r.work_id = w.work_id
ORDER BY w.work_id;
