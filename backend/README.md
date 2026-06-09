# Buku Tamu Backend

## Prasyarat
- Node.js (versi 16+)
- MySQL Server

## Instalasi
1. Clone repository
2. Masuk ke direktori backend:
   ```bash
   cd backend
   ```
3. Salin `.env.example` menjadi `.env` dan sesuaikan konfigurasi
4. Install dependencies:
   ```bash
   npm install
   ```

## Konfigurasi Database
- Buat database MySQL bernama `buku_tamu_db`
- Buat user `buku_tamu_app` dengan akses ke database
- Update kredensial di file `.env`

## Menjalankan Aplikasi
### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## Struktur Proyek
- `src/`: Kode sumber TypeScript
- `dist/`: Kode JavaScript hasil kompilasi
- `.env`: Konfigurasi environment
- `tsconfig.json`: Konfigurasi TypeScript

## Endpoint API
- `POST /api/tamu`: Tambah entri buku tamu
- `GET /api/tamu`: Ambil daftar entri buku tamu

## Teknologi
- Express.js
- TypeScript
- MySQL
- Dotenv

## Troubleshooting
- Pastikan MySQL berjalan
- Periksa koneksi database di `.env`
- Cek console untuk pesan error