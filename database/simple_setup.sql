-- Create Tamu (Guest) Table
CREATE TABLE IF NOT EXISTS tamu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    telepon VARCHAR(20) NOT NULL,
    dari ENUM('umum', 'instansi', 'organisasi') NOT NULL DEFAULT 'umum',
    nama_instansi VARCHAR(255),
    keperluan TEXT NOT NULL,
    waktu_kunjungan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_nama ON tamu(nama);
CREATE INDEX IF NOT EXISTS idx_dari ON tamu(dari);
CREATE INDEX IF NOT EXISTS idx_waktu_kunjungan ON tamu(waktu_kunjungan);

-- Create a view for reporting
CREATE OR REPLACE VIEW laporan_kunjungan AS
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