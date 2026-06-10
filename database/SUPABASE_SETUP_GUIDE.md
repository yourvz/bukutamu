# 📦 Panduan Setup Supabase untuk Buku Tamu

## 1. Buat Project Supabase

1. Buka [https://supabase.com](https://supabase.com)
2. Sign up atau login ke dashboard
3. Klik **"New Project"**
4. Pilih organisasi dan isi detail project:
   - **Name**: `buku-tamu` atau nama lain
   - **Database Password**: Buat password yang kuat (simpan untuk backup)
   - **Region**: Pilih yang terdekat (Singapore untuk Indonesia)
5. Klik **"Create new project"** dan tunggu beberapa menit

## 2. Dapatkan API Keys

1. Setelah project siap, buka **Settings** → **API**
2. Catat informasi berikut:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon (public) key**: Key untuk client-side (aman di-expose)
   - **service_role key**: Key untuk backend (RAHASIA!)

## 3. Jalankan SQL Migration

1. Di dashboard Supabase, buka **SQL Editor**
2. Klik **"New query"**
3. Copy-paste isi file `supabase_migration.sql` dari folder database
4. Klik **"Run"** untuk menjalankan migration
5. Verifikasi tabel `tamu` sudah terbuat di **Table Editor**

## 4. Konfigurasi Backend

1. Buka file `backend/.env` dan isi dengan kredensial Supabase:

```env
# Server Configuration
APP_PORT=3000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# CORS Configuration
CORS_ORIGIN=http://localhost:5174,http://127.0.0.1:5174
```

2. Install dependencies baru:
```bash
cd backend
npm install
```

3. Jalankan server:
```bash
npm run dev
```

## 5. Test Koneksi

1. Buka browser: `http://localhost:3000/api/health`
2. Harus muncul: `{"status":"ok","database":"supabase",...}`

## 6. Struktur Tabel di Supabase

### Tabel `tamu`
| Column           | Type                     | Description              |
|------------------|--------------------------|--------------------------|
| id               | UUID                     | Primary key (auto)       |
| nama             | VARCHAR(255)             | Nama lengkap tamu        |
| email            | VARCHAR(255)             | Alamat email             |
| keperluan        | TEXT                     | Tujuan kunjungan         |
| waktu_kunjungan  | TIMESTAMP WITH TIME ZONE | Waktu registrasi         |
| ip_address       | VARCHAR(45)              | IP address client        |
| user_agent       | TEXT                     | Browser info             |
| created_at       | TIMESTAMP WITH TIME ZONE | Waktu dibuat             |
| updated_at       | TIMESTAMP WITH TIME ZONE | Waktu diupdate           |

## 7. Row Level Security (RLS)

Migration sudah mengaktifkan RLS dengan policies:
- **Anonymous users**: Hanya bisa INSERT (mendaftar sebagai tamu)
- **Authenticated users**: Bisa SELECT (melihat data)
- **Service role**: Full access (untuk backend)

## 8. Troubleshooting

### Error: "Missing Supabase credentials"
- Pastikan file `.env` ada di folder `backend/`
- Pastikan `SUPABASE_URL` dan `SUPABASE_SERVICE_ROLE_KEY` terisi

### Error: "relation 'tamu' does not exist"
- Jalankan SQL migration di Supabase SQL Editor
- Pastikan tabel `tamu` terlihat di Table Editor

### Error: "new row violates row-level security policy"
- Pastikan menggunakan `service_role` key di backend
- Atau update RLS policy sesuai kebutuhan

---

## 📱 Opsional: Akses Langsung dari Frontend

Untuk fitur real-time atau bypass backend, tambahkan di `.env` (root project):

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Dan install di frontend:
```bash
npm install @supabase/supabase-js
```

---

✅ **Setup selesai!** Aplikasi Buku Tamu sekarang terhubung dengan Supabase.
