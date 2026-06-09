# Buku Tamu Aplikasi

## Deskripsi
Aplikasi Buku Tamu dengan frontend Vue.js, backend Express.js, dan database MySQL. Memungkinkan pencatatan tamu dengan detail lengkap dan validasi.

## Prasyarat
- Node.js (versi 16+)
- npm
- MySQL Server (versi 8.0+)

## Instalasi

### Database
1. Buka MySQL CLI
2. Jalankan script database: 
   ```bash
   mysql -u root -p < database/buku_tamu.sql
   ```
3. Ganti password default di `.env` file

### Backend
1. Masuk ke direktori backend
   ```bash
   cd backend
   npm install
   ```
2. Konfigurasi `.env` dengan detail koneksi database
3. Jalankan server:
   ```bash
   npm run dev  # Development
   npm run build  # Production build
   npm start  # Jalankan production
   ```

### Frontend
1. Kembali ke root project
   ```bash
   cd ..
   npm install
   ```
2. Jalankan development server:
   ```bash
   npm run dev
   ```

## Struktur Proyek
- `database/`: Script dan dokumentasi database
- `backend/`: Server Express.js dengan API endpoint
- `src/`: Kode sumber frontend Vue.js
- `.env`: Konfigurasi environment

## Fitur
- Real-time waktu pencatatan
- Input data tamu dengan validasi
- Kategorisasi asal tamu
- Backend API untuk penyimpanan data
- Error handling pada form

## Teknologi
- Frontend: Vue 3, Typescript, Vite
- Backend: Express.js, MySQL
- Validasi: Frontend & Backend

## Keamanan
- Validasi input di frontend dan backend
- Prepared statement untuk mencegah SQL Injection
- Environment variable untuk konfigurasi rahasia

## Kontribusi
1. Fork repository
2. Buat branch fitur
3. Commit perubahan
4. Push ke branch
5. Buat Pull Request

## Lisensi
[Tentukan lisensi, contoh: MIT]