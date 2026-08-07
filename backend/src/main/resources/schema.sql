-- Schema for NexusGov Application (MySQL / PostgreSQL / H2 compatible)
-- Note: For MySQL database creation, execute: CREATE DATABASE IF NOT EXISTS nexusgov_db; USE nexusgov_db;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    secure_pin VARCHAR(10) DEFAULT NULL
);
