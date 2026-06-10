-- ============================================
-- SUPABASE MIGRATION - BUKU TAMU
-- ============================================
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
CREATE POLICY "Allow anonymous inserts" ON tamu
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Create policy to allow authenticated reads
CREATE POLICY "Allow authenticated reads" ON tamu
    FOR SELECT
    TO authenticated
    USING (true);

-- Create policy to allow service role full access
CREATE POLICY "Allow service role full access" ON tamu
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_tamu_updated_at ON tamu;
CREATE TRIGGER update_tamu_updated_at
    BEFORE UPDATE ON tamu
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Optional: Create function for easy statistics
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
        COUNT(*) FILTER (WHERE waktu_kunjungan >= DATE_TRUNC('week', CURRENT_DATE))::BIGINT as kunjungan_minggu_ini,
        COUNT(*) FILTER (WHERE waktu_kunjungan >= DATE_TRUNC('month', CURRENT_DATE))::BIGINT as kunjungan_bulan_ini
    FROM tamu;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission on function
GRANT EXECUTE ON FUNCTION get_tamu_statistics() TO authenticated;
