# Database Setup for Buku Tamu Application

## Prasyarat
- MySQL Server (versi 8.0+)
- MySQL Client atau phpMyAdmin

## Langkah Instalasi
1. Buka MySQL CLI atau phpMyAdmin
2. Jalankan script `buku_tamu.sql`
3. Ganti password default di script dengan password yang aman

## Struktur Tabel
### Tabel `tamu`
- `id`: Identifier unik (Primary Key)
- `nama`: Nama lengkap pengunjung
- `dari`: Kategori pengunjung (umum/instansi/organisasi)
- `nama_instansi`: Nama instansi/organisasi (opsional)
- `keperluan`: Tujuan kunjungan
- `waktu_kunjungan`: Timestamp kunjungan
- `ip_address`: Alamat IP pengunjung
- `user_agent`: Informasi browser/perangkat

## View `laporan_kunjungan`
View untuk laporan dengan kategorisasi dan urutan waktu terbaru

## Konfigurasi Koneksi
- User: `buku_tamu_app`
- Database: `buku_tamu_db`
- **PENTING**: Ganti password default sebelum produksi!