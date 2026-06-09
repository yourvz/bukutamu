-- Create Database
DROP DATABASE IF EXISTS buku_tamu_db;
CREATE DATABASE buku_tamu_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE buku_tamu_db;

-- Create Tamu (Guest) Table
CREATE TABLE tamu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    dari ENUM('umum', 'instansi', 'organisasi') NOT NULL DEFAULT 'umum',
    nama_instansi VARCHAR(255),
    keperluan TEXT NOT NULL,
    waktu_kunjungan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT
);

-- Create index for performance
CREATE INDEX idx_nama ON tamu(nama);
CREATE INDEX idx_dari ON tamu(dari);
CREATE INDEX idx_waktu_kunjungan ON tamu(waktu_kunjungan);

-- Optional: Create a view for easy reporting
CREATE VIEW laporan_kunjungan AS
SELECT 
    id, 
    nama, 
    dari, 
    nama_instansi, 
    keperluan, 
    waktu_kunjungan,
    CASE 
        WHEN dari = 'umum' THEN 'Umum'
        WHEN dari = 'instansi' THEN 'Instansi'
        WHEN dari = 'organisasi' THEN 'Organisasi'
    END AS kategori_kunjungan
FROM tamu
ORDER BY waktu_kunjungan DESC;

-- Create user for application connection
CREATE USER IF NOT EXISTS 'buku_tamu_app'@'localhost' IDENTIFIED BY 'ParkirApp2026!';
GRANT ALL PRIVILEGES ON buku_tamu_db.* TO 'buku_tamu_app'@'localhost';
FLUSH PRIVILEGES;