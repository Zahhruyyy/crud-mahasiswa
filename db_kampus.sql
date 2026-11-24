-- Database untuk proyek CRUD Mahasiswa
CREATE DATABASE IF NOT EXISTS db_kampus CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE db_kampus;

-- Tabel mahasiswa
CREATE TABLE IF NOT EXISTS mahasiswa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nim VARCHAR(20) NOT NULL,
    nama VARCHAR(100) NOT NULL,
    jurusan VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data contoh (seed)
INSERT INTO mahasiswa (nim, nama, jurusan, email) VALUES
('240101001', 'Budi Santoso', 'Teknik Informatika', 'budi@kampus.ac.id'),
('240101002', 'Siti Aminah', 'Sistem Informasi', 'siti@kampus.ac.id'),
('240101003', 'Andi Wijaya', 'Manajemen Informatika', 'andi@kampus.ac.id');