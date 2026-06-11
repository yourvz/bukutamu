-- ============================================
-- MIGRATION V2 - BUKU TAMU
-- Add constraint: nama_instansi required for instansi/organisasi
-- ============================================
-- Run this SQL in your Supabase SQL Editor if v1 migration already exists

-- Note: This is a documentation file showing the expected constraints
-- Supabase doesn't enforce NOT NULL for specific conditions at DB level
-- We validate this in the application layer (React frontend)

-- If you want to enforce at application layer, the frontend validates:
-- - If dari = 'instansi' OR dari = 'organisasi', then nama_instansi is REQUIRED
-- - If dari = 'umum', then nama_instansi is optional (but will be empty)

-- Optional: Add a CHECK constraint that nama_instansi is NOT NULL 
-- when dari is 'instansi' or 'organisasi' (if your DB supports it)

-- Add column comment for clarity
COMMENT ON COLUMN tamu.nama_instansi IS 'Required when dari is instansi or organisasi';

-- Verify data integrity - show records where dari is instansi/organisasi but nama_instansi is empty
-- Run this query to identify any problematic records:
SELECT id, nama, dari, nama_instansi
FROM tamu
WHERE (dari = 'instansi' OR dari = 'organisasi')
AND (nama_instansi IS NULL OR nama_instansi = '');

-- If there are any records, you may want to update them:
-- UPDATE tamu
-- SET nama_instansi = 'Unknown'
-- WHERE (dari = 'instansi' OR dari = 'organisasi')
-- AND (nama_instansi IS NULL OR nama_instansi = '');

-- Add additional view for monitoring
CREATE OR REPLACE VIEW laporan_kunjungan_v2 AS
SELECT 
    id,
    nama,
    telepon,
    dari,
    nama_instansi,
    keperluan,
    waktu_kunjungan,
    CASE 
        WHEN dari = 'umum' THEN 'Umum (Pribadi)'
        WHEN dari = 'instansi' THEN 'Instansi: ' || COALESCE(nama_instansi, 'Unknown')
        WHEN dari = 'organisasi' THEN 'Organisasi: ' || COALESCE(nama_instansi, 'Unknown')
    END AS kunjungan_detail,
    created_at
FROM tamu
ORDER BY waktu_kunjungan DESC;

-- Create view for instansi/organisasi summary
CREATE OR REPLACE VIEW ringkasan_instansi_organisasi AS
SELECT 
    dari,
    nama_instansi,
    COUNT(*) as jumlah_kunjungan,
    MAX(waktu_kunjungan) as kunjungan_terakhir
FROM tamu
WHERE dari IN ('instansi', 'organisasi') 
AND nama_instansi IS NOT NULL 
AND nama_instansi != ''
GROUP BY dari, nama_instansi
ORDER BY jumlah_kunjungan DESC;
