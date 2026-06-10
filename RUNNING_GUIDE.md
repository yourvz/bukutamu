# 🚀 Panduan Menjalankan Buku Tamu Application

## Prasyarat
- Node.js v20+ terinstall
- Supabase account dengan project sudah setup
- File `.env` backend sudah dikonfigurasi dengan kredensial Supabase

---

## 🔧 Setup Awal (Sekali Saja)

### 1. Konfigurasi Supabase (Jika Belum)

Jika belum setup Supabase:
1. Buka [Supabase Dashboard](https://app.supabase.com)
2. Buat project baru
3. Di **SQL Editor**, jalankan script dari `database/supabase_migration.sql`
4. Catat kredensial dari **Settings → API**

### 2. Konfigurasi Backend Environment

Edit file `backend/.env`:
```env
APP_PORT=3000
NODE_ENV=development
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
CORS_ORIGIN=http://localhost:5174,http://127.0.0.1:5174,http://localhost:5175,http://127.0.0.1:5175
```

### 3. Install Dependencies

```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

---

## 🎯 Menjalankan Aplikasi

### Opsi 1: Menggunakan 2 Terminal (Recommended)

**Terminal 1 - Backend:**
```bash
cd F:\apps\Tamu\backend
node node_modules/.bin/tsc  # Compile TypeScript
node dist/server.js         # Jalankan server
```

**Terminal 2 - Frontend:**
```bash
cd F:\apps\Tamu
node node_modules/vite/bin/vite.js --port 5174
```

Atau jika port 5174 sudah terpakai, akan otomatis pindah ke port 5175.

---

## 🌐 Akses Aplikasi

Buka browser dan navigasi ke:
- **Frontend**: `http://localhost:5174/` (atau 5175 jika 5174 sudah terpakai)
- **Backend Health Check**: `http://localhost:3000/api/health`

---

## 📝 Cara Menggunakan Aplikasi

### Form Buku Tamu

1. **Nama Pengunjung** - Isi nama lengkap
2. **No. Telepon** - Isi nomor telepon (minimal 8 karakter)
3. **Dari** - Pilih kategori:
   - **Umum** - Untuk pengunjung umum
   - **Instansi** - Untuk pengunjung dari instansi (field tambahan muncul)
   - **Organisasi** - Untuk pengunjung dari organisasi (field tambahan muncul)
4. **Nama Instansi/Organisasi** - Isi jika pilih Instansi/Organisasi
5. **Keperluan Kunjungan** - Jelaskan tujuan kunjungan
6. Klik **Kirim** untuk submit

### Validasi Form
- Semua field wajib diisi
- Format telepon harus valid
- Instansi/Organisasi harus diisi jika dipilih di dropdown "Dari"
- Pesan error ditampilkan jika ada validasi gagal

---

## 🗄️ Database

### Struktur Tabel `tamu`

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | UUID | Primary key |
| nama | VARCHAR(255) | Nama pengunjung |
| telepon | VARCHAR(20) | Nomor telepon |
| dari | ENUM | Kategori: umum/instansi/organisasi |
| nama_instansi | VARCHAR(255) | Nama instansi/organisasi (nullable) |
| keperluan | TEXT | Tujuan kunjungan |
| waktu_kunjungan | TIMESTAMP | Waktu registrasi (auto) |
| ip_address | VARCHAR(45) | IP address pengunjung |
| user_agent | TEXT | Browser info |
| created_at | TIMESTAMP | Waktu dibuat (auto) |
| updated_at | TIMESTAMP | Waktu diupdate (auto) |

### Views & Functions

- **View**: `laporan_kunjungan` - Report data kunjungan
- **Function**: `get_tamu_statistics()` - Statistik kunjungan

---

## 🔌 API Endpoints

### Daftar Kunjungan (POST)
```
POST /api/tamu
Content-Type: application/json

{
  "nama": "Budi Santoso",
  "telepon": "08123456789",
  "dari": "instansi",
  "nama_instansi": "PT Maju Jaya",
  "keperluan": "Meeting dengan tim marketing"
}

Response 201:
{
  "message": "Buku Tamu entry added successfully",
  "id": "uuid-xxx",
  "data": { ...record }
}
```

### Lihat Semua Kunjungan (GET)
```
GET /api/tamu

Response 200: [array of tamu records]
```

### Statistik Kunjungan (GET)
```
GET /api/tamu/statistics

Response 200:
{
  "total_kunjungan": 10,
  "kunjungan_hari_ini": 3,
  "kunjungan_minggu_ini": 7,
  "kunjungan_bulan_ini": 10
}
```

### Health Check (GET)
```
GET /api/health

Response 200:
{
  "status": "ok",
  "database": "supabase",
  "timestamp": "2026-06-10T12:00:00.000Z"
}
```

---

## 🐛 Troubleshooting

### Backend Error: "Missing Supabase credentials"
- Pastikan file `backend/.env` ada dan terisi
- Pastikan `SUPABASE_URL` dan `SUPABASE_SERVICE_ROLE_KEY` benar
- Restart backend setelah update `.env`

### CORS Error di Browser
- Backend tidak mendengar request dari frontend port
- Pastikan backend CORS sudah include port frontend (lihat `.env`)
- Restart backend setelah update CORS

### Port Already in Use
- Jika port 5174/3000 sudah terpakai, ubah di command atau `.env`
- Vite akan otomatis mencari port berikutnya jika 5174 unavailable

### Data Tidak Tersimpan
- Check apakah Supabase connection berhasil (lihat server log)
- Verifikasi permission Supabase RLS policies
- Cek network tab browser untuk error response dari API

---

## 📦 Development Mode

Untuk development lebih produktif:

1. **Watch TypeScript Backend**:
   ```bash
   cd backend
   npx ts-node --watch src/server.ts
   ```

2. **Dengan Nodemon** (auto-restart):
   ```bash
   cd backend
   npm run dev  # Jika sudah configured
   ```

3. **HMR Frontend**:
   Vite sudah support Hot Module Replacement otomatis

---

## 🚀 Production Deployment

### Build Frontend
```bash
npm run build
# Output: dist/ folder
```

### Build Backend
```bash
cd backend
npm run build
# Output: dist/server.js
```

### Run Production
```bash
# Backend
NODE_ENV=production node dist/server.js

# Frontend
Serve dist/ folder dengan web server (nginx, apache, etc.)
```

---

## 📚 Dokumentasi Tambahan

- **Setup Supabase**: Lihat `database/SUPABASE_SETUP_GUIDE.md`
- **Database Migration**: Lihat `database/supabase_migration.sql`
- **Environment Variables**: Lihat `backend/.env.example`

---

## ✅ Checklist Setup Sukses

- [ ] Node.js v20+ terinstall
- [ ] Supabase project sudah dibuat
- [ ] SQL migration sudah dijalankan
- [ ] `.env` backend sudah dikonfigurasi
- [ ] Dependencies sudah diinstall (`npm install`)
- [ ] Backend berjalan di port 3000
- [ ] Frontend berjalan di port 5174/5175
- [ ] Form dapat diisi dan disubmit
- [ ] Data terlihat di Supabase dashboard

---

**Selamat menggunakan Buku Tamu Application!** 🎉
