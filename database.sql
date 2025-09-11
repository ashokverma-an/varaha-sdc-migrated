-- Hospital Management System Database Schema
-- Complete migration with all tables and test data for all roles

CREATE DATABASE IF NOT EXISTS hospital_management;
USE hospital_management;

-- Hospital table
CREATE TABLE IF NOT EXISTS hospital (
    h_id INT AUTO_INCREMENT PRIMARY KEY,
    h_name VARCHAR(255) NOT NULL,
    h_short VARCHAR(50) NOT NULL,
    h_address TEXT,
    h_contact VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doctor table
CREATE TABLE IF NOT EXISTS doctor (
    d_id INT AUTO_INCREMENT PRIMARY KEY,
    dname VARCHAR(255) NOT NULL,
    specialization VARCHAR(255),
    contact VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scan types table
CREATE TABLE IF NOT EXISTS scan (
    s_id INT AUTO_INCREMENT PRIMARY KEY,
    s_name VARCHAR(255) NOT NULL,
    s_amount DECIMAL(10,2) DEFAULT 0,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Time slots table
CREATE TABLE IF NOT EXISTS time_slot2 (
    time_id INT AUTO_INCREMENT PRIMARY KEY,
    time_slot TIME NOT NULL,
    status ENUM('available', 'booked') DEFAULT 'available'
);

-- Patient registration table
CREATE TABLE IF NOT EXISTS patient_new (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    pre VARCHAR(10) DEFAULT 'Mr.',
    patient_name VARCHAR(255) NOT NULL,
    hospital_id INT,
    doctor_name INT,
    cro VARCHAR(100) UNIQUE NOT NULL,
    age VARCHAR(20),
    gender ENUM('Male', 'Female', 'Other') DEFAULT 'Male',
    category VARCHAR(50) DEFAULT 'General',
    p_uni_id_submit VARCHAR(50),
    p_uni_id_name VARCHAR(255),
    `enroll_no.` VARCHAR(100),
    date VARCHAR(20),
    contact_number VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    scan_type TEXT,
    total_scan INT DEFAULT 0,
    amount DECIMAL(10,2) DEFAULT 0,
    discount DECIMAL(10,2) DEFAULT 0,
    amount_reci DECIMAL(10,2) DEFAULT 0,
    amount_due DECIMAL(10,2) DEFAULT 0,
    allot_date VARCHAR(20),
    allot_time INT,
    scan_date VARCHAR(20),
    allot_time_out INT,
    admin_id INT DEFAULT 1,
    scan_status INT DEFAULT 0,
    examination_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hospital_id) REFERENCES hospital(h_id),
    FOREIGN KEY (doctor_name) REFERENCES doctor(d_id),
    FOREIGN KEY (allot_time) REFERENCES time_slot2(time_id)
);

-- Console table for scan scheduling
CREATE TABLE IF NOT EXISTS console (
    id INT AUTO_INCREMENT PRIMARY KEY,
    c_p_cro VARCHAR(100),
    examination_id VARCHAR(100),
    number_films INT DEFAULT 0,
    number_contrast INT DEFAULT 0,
    number_scan INT DEFAULT 0,
    issue_cd VARCHAR(10) DEFAULT 'No',
    start_time TIME,
    stop_time TIME,
    gap VARCHAR(20),
    technician_name VARCHAR(255),
    nursing_name VARCHAR(255),
    remark TEXT,
    added_on VARCHAR(20),
    status ENUM('Pending', 'Complete', 'Recall') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lab bench table for console queue
CREATE TABLE IF NOT EXISTS lab_banch (
    p_id INT AUTO_INCREMENT PRIMARY KEY,
    cro_number VARCHAR(100),
    c_status INT DEFAULT 1,
    added_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Coridor table for nursing and doctor queue
CREATE TABLE IF NOT EXISTS coridor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cro_number VARCHAR(100),
    n_status INT DEFAULT 1,
    examination_id INT DEFAULT 0,
    added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Daily transactions table
CREATE TABLE IF NOT EXISTS today_transeciton (
    id INT AUTO_INCREMENT PRIMARY KEY,
    r_amount DECIMAL(10,2) DEFAULT 0,
    d_amount DECIMAL(10,2) DEFAULT 0,
    cro VARCHAR(100),
    added_on VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Category table
CREATE TABLE IF NOT EXISTS category (
    cat_id INT AUTO_INCREMENT PRIMARY KEY,
    cat_name VARCHAR(255) NOT NULL,
    cat_amount DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table for all roles
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    admin_type ENUM('admin', 'superadmin', 'doctor', 'nurse', 'console') DEFAULT 'admin',
    hospital_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hospital_id) REFERENCES hospital(h_id)
);

-- Insert sample hospitals
INSERT INTO hospital (h_name, h_short, h_address, h_contact) VALUES
('Dr. S.N. Medical College', 'SNMC', 'Jodhpur, Rajasthan', '+91-291-2648120'),
('M.D.M Hospital', 'MDM', 'Jodhpur, Rajasthan', '+91-291-2648121'),
('Varaha SDC', 'VSDC', 'Jodhpur, Rajasthan', '+91-291-2648122');

-- Insert sample doctors
INSERT INTO doctor (dname, specialization, contact) VALUES
('Dr. Sharma', 'Radiology', '+91-9876543210'),
('Dr. Patel', 'Cardiology', '+91-9876543211'),
('Dr. Singh', 'Orthopedics', '+91-9876543212'),
('Dr. Gupta', 'Neurology', '+91-9876543213'),
('Dr. Verma', 'General Medicine', '+91-9876543214');

-- Insert scan types
INSERT INTO scan (s_name, s_amount, category) VALUES
('CT Scan Head', 2500.00, 'CT'),
('CT Scan Chest', 3000.00, 'CT'),
('CT Scan Abdomen', 3500.00, 'CT'),
('MRI Brain', 5000.00, 'MRI'),
('MRI Spine', 5500.00, 'MRI'),
('X-Ray Chest', 500.00, 'X-Ray'),
('X-Ray Abdomen', 600.00, 'X-Ray'),
('Ultrasound Abdomen', 1200.00, 'Ultrasound'),
('Ultrasound Pelvis', 1000.00, 'Ultrasound'),
('ECG', 300.00, 'Cardiac');

-- Insert time slots
INSERT INTO time_slot2 (time_slot) VALUES
('09:00:00'), ('09:30:00'), ('10:00:00'), ('10:30:00'), ('11:00:00'),
('11:30:00'), ('12:00:00'), ('14:00:00'), ('14:30:00'), ('15:00:00'),
('15:30:00'), ('16:00:00'), ('16:30:00'), ('17:00:00'), ('17:30:00');

-- Insert categories
INSERT INTO category (cat_name, cat_amount) VALUES
('General', 0),
('Chiranjeevi', 0),
('RGHS', 0),
('RTA', 0),
('OPD FREE', 0),
('IPD FREE', 0),
('BPL/POOR', 0),
('Sn. CITIZEN', 0);

-- Create test users for all roles (password: admin123 for all)
INSERT INTO users (username, password, admin_type, hospital_id) VALUES
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 1),
('superadmin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'superadmin', NULL),
('doctor', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'doctor', 1),
('nurse', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'nurse', 1),
('console', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'console', 1);

-- Insert sample patients
INSERT INTO patient_new (pre, patient_name, hospital_id, doctor_name, cro, age, gender, category, `enroll_no.`, date, contact_number, address, city, scan_type, total_scan, amount, discount, amount_reci, amount_due, allot_date, allot_time, admin_id, scan_status) VALUES
('Mr.', 'JOHN DOE', 1, 1, 'VDC/12-01-2024/1', '35Years', 'Male', 'General', 'VDC/12-01-2024/1', '12-01-2024', '9876543210', '123 Main St', 'Jodhpur', 'CT Scan Head', 1, 2500.00, 0.00, 2500.00, 0.00, '12-01-2024', 1, 1, 0),
('Mrs.', 'JANE SMITH', 1, 2, 'VDC/12-01-2024/2', '28Years', 'Female', 'Chiranjeevi', 'VDC/12-01-2024/2', '12-01-2024', '9876543211', '456 Oak Ave', 'Jodhpur', 'X-Ray Chest', 1, 0.00, 0.00, 0.00, 0.00, '12-01-2024', 2, 1, 0),
('Mr.', 'ROBERT JOHNSON', 2, 3, 'VDC/12-01-2024/3', '45Years', 'Male', 'RGHS', 'VDC/12-01-2024/3', '12-01-2024', '9876543212', '789 Pine St', 'Jodhpur', 'MRI Brain', 1, 0.00, 0.00, 0.00, 0.00, '12-01-2024', 3, 1, 0);

-- Insert sample lab bench entries for console queue
INSERT INTO lab_banch (cro_number, c_status) VALUES
('VDC/12-01-2024/1', 1),
('VDC/12-01-2024/2', 1);

-- Insert sample coridor entries for nursing and doctor queue
INSERT INTO coridor (cro_number, n_status, examination_id) VALUES
('VDC/12-01-2024/1', 1, 0),
('VDC/12-01-2024/2', 1, 0),
('VDC/12-01-2024/3', 1, 1);