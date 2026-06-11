-- ============================================
-- SUPABASE MIGRATION - BUKU TAMU
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- Go to: SQL Editor → New Query → Paste this → Run

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing table if needed (CAUTION: This will delete data!)
-- DROP TABLE IF EXISTS tamu CASCADE;

-- Create Tamu (Guest) Table
CREATE TABLE IF NOT EXISTS tamu (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    telepon VARCHAR(20) NOT NULL,
    dari VARCHAR(20) NOT NULL DEFAULT 'umum' CHECK (dari IN ('umum', 'instansi', 'organisasi')),
    nama_instansi VARCHAR(255),
    keperluan TEXT NOT NULL,
    waktu_kunjungan TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tamu_nama ON tamu(nama);
CREATE INDEX IF NOT EXISTS idx_tamu_telepon ON tamu(telepon);
CREATE INDEX IF NOT EXISTS idx_tamu_dari ON tamu(dari);
CREATE INDEX IF NOT EXISTS idx_tamu_waktu_kunjungan ON tamu(waktu_kunjungan DESC);
CREATE INDEX IF NOT EXISTS idx_tamu_created_at ON tamu(created_at DESC);

-- Create view for reporting
CREATE OR REPLACE VIEW laporan_kunjungan AS
SELECT 
    id,
    nama,
    telepon,
    dari,
    nama_instansi,
    keperluan,
    waktu_kunjungan,
    CASE 
        WHEN dari = 'umum' THEN 'Umum'
        WHEN dari = 'instansi' THEN 'Instansi'
        WHEN dari = 'organisasi' THEN 'Organisasi'
    END AS kategori_kunjungan,
    created_at
FROM tamu
ORDER BY waktu_kunjungan DESC;

-- Enable Row Level Security (RLS)
ALTER TABLE tamu ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts (for public guest registration)
CREATE POLICY "Enable insert for anonymous" ON tamu
    FOR INSERT
    WITH CHECK (true);

-- Create policy to allow authenticated reads (optional)
CREATE POLICY "Enable select for all" ON tamu
    FOR SELECT
    USING (true);

-- Drop existing triggers if any
DROP TRIGGER IF EXISTS update_tamu_updated_at ON tamu;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_tamu_updated_at
    BEFORE UPDATE ON tamu
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Optional: Create function for statistics
CREATE OR REPLACE FUNCTION get_tamu_statistics()
RETURNS TABLE (
    total_kunjungan BIGINT,
    kunjungan_hari_ini BIGINT,
    kunjungan_minggu_ini BIGINT,
    kunjungan_bulan_ini BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT as total_kunjungan,
        COUNT(*) FILTER (WHERE DATE(waktu_kunjungan) = CURRENT_DATE)::BIGINT as kunjungan_hari_ini,
        COUNT(*) FILTER (WHERE waktu_kunjungan >= CURRENT_DATE - INTERVAL '7 days')::BIGINT as kunjungan_minggu_ini,
        COUNT(*) FILTER (WHERE DATE_TRUNC('month', waktu_kunjungan) = DATE_TRUNC('month', CURRENT_DATE))::BIGINT as kunjungan_bulan_ini;
END;
$$ LANGUAGE plpgsql;

-- Optional: Create view for daily statistics
CREATE OR REPLACE VIEW statistik_harian AS
SELECT 
    DATE(waktu_kunjungan) as tanggal,
    COUNT(*) as total_kunjungan,
    COUNT(*) FILTER (WHERE dari = 'umum') as dari_umum,
    COUNT(*) FILTER (WHERE dari = 'instansi') as dari_instansi,
    COUNT(*) FILTER (WHERE dari = 'organisasi') as dari_organisasi
FROM tamu
GROUP BY DATE(waktu_kunjungan)
ORDER BY tanggal DESC;

-- Grant permissions to anon role for public access
GRANT SELECT, INSERT ON tamu TO anon;
GRANT SELECT ON laporan_kunjungan TO anon;
GRANT SELECT ON statistik_harian TO anon;

-- Done! The table is ready for use.
-- Insert sample data (optional - remove this in production):
/*
INSERT INTO tamu (nama, telepon, dari, nama_instansi, keperluan) VALUES
('Budi Santoso', '081234567890', 'umum', NULL, 'Mendatangi kantor untuk mengurus surat'),
('Siti Nurhaliza', '082345678901', 'instansi', 'PT Maju Jaya', 'Kunjungan kerja sama bisnis'),
('Ahmad Wijaya', '083456789012', 'organisasi', 'OSIS SMA Negeri 1', 'Acara gathering pelajar');
*/
