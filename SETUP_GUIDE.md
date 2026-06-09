# Buku Tamu Project Setup Guide

## Prasyarat
- Node.js (versi 16+)
- npm
- MySQL Server atau XAMPP

## Langkah Instalasi

### 1. Database Setup
1. Buka MySQL Command Line atau phpMyAdmin
2. Jalankan script `database/setup_database.bat`
   - Gunakan password root MySQL Anda
3. Database akan dibuat dengan nama `buku_tamu_db`
4. User `buku_tamu_app` akan dibuat dengan password `ParkirApp2026!`

### 2. Konfigurasi Backend
1. Buka `backend/.env`
2. Pastikan kredensial database sudah benar
   - Host: 127.0.0.1
   - Port: 3306
   - User: buku_tamu_app
   - Password: ParkirApp2026!
   - Database: buku_tamu_db

### 3. Instalasi Dependensi
```bash
# Instal dependensi frontend
npm install

# Instal dependensi backend
cd backend
npm install
cd ..
```

### 4. Jalankan Proyek
- Gunakan `start_project.bat` untuk memulai
- Atau jalankan manual:
  ```bash
  # Terminal 1 (Backend)
  cd backend
  npm run dev

  # Terminal 2 (Frontend)
  npm run dev
  ```

## Akses Aplikasi
- Frontend: `http://localhost:5174`
- Backend API: `http://localhost:3000`

## Troubleshooting
- Pastikan MySQL berjalan
- Periksa koneksi internet
- Pastikan port 3000 dan 5174 tersedia
- Cek console untuk pesan error

## Catatan Keamanan
- Ganti password default sebelum produksi
- Gunakan koneksi database yang aman
- Terapkan prinsip keamanan berlapis

## Versi
- Vue.js 3
- Express.js
- MySQL
- Tanggal Dibuat: 2026-06-09