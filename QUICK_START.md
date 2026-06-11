# ⚡ Quick Start Guide - Buku Tamu Digital

**Status**: ✅ Ready to deploy (dengan Supabase credentials sudah di GitHub Secrets)

---

## 🚀 Step 1: Setup Database Supabase (5 menit)

### Di Supabase Dashboard:
1. Login: https://app.supabase.com
2. Go to SQL Editor
3. Buat query baru
4. Copy-paste dari file: `SUPABASE_MIGRATION.sql` 
5. Run query

**Hasil**: Tabel `tamu` sudah siap dengan:
- Fields: nama, telepon, dari, nama_instansi, keperluan
- RLS policies enabled
- Indexes untuk performa
- Views untuk reporting

---

## 📋 Database Schema

```
Tabel: tamu
├── id (UUID) - Primary Key
├── nama (VARCHAR) - Nama lengkap *
├── telepon (VARCHAR) - No telepon *
├── dari (VARCHAR) - Category: umum/instansi/organisasi *
├── nama_instansi (VARCHAR) - Instansi/Organisasi (optional)
├── keperluan (TEXT) - Deskripsi keperluan *
├── waktu_kunjungan (TIMESTAMP) - Auto timestamp
├── created_at (TIMESTAMP) - Created timestamp
└── updated_at (TIMESTAMP) - Updated timestamp
```

**Required fields**: nama, telepon, dari, keperluan

---

## 📱 Form Fields

| Field | Type | Required | Example |
|-------|------|----------|---------|
| Nama | Text | ✅ | Budi Santoso |
| Telepon | Tel | ✅ | 081234567890 |
| Dari | Select | ✅ | Umum / Instansi / Organisasi |
| Instansi | Text | ❌ | PT Maju Jaya |
| Keperluan | Textarea | ✅ | Mendatangi kantor... |

---

## 🎨 UI Components

**Form Section**:
- Header dengan emoji: 📝 Daftarkan Kunjungan Anda
- Input fields dengan validasi
- Submit button dengan loading state
- Error messages display

**Visitors Section**:
- Header dengan emoji: 📋 Daftar Pengunjung Terbaru
- Visitor cards dengan:
  - 👤 Nama lengkap
  - 📞 Telepon
  - 🏢 Kategori badge (Umum/Instansi/Organisasi)
  - 🏛️ Instansi/Organisasi
  - 📌 Keperluan (formatted text)
  - 🕐 Timestamp

**Status Badges**:
- 🔵 Umum (Blue)
- 🟢 Instansi (Green)
- 🟠 Organisasi (Orange)

---

## 🔐 GitHub Secrets (Already Set)

Dari screenshot, Anda sudah set:
```
NEXT_PUBLIC_SUPABASE_URL = https://uwnpifnkdqneafcaiyhz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = sb_publishable_XzBy5H98yapUKN1dO5qDIw_iq_UHNlV
```

✅ **Status**: GitHub Secrets sudah configured!

---

## 📦 Files yang Penting

| File | Fungsi |
|------|--------|
| `app/page.tsx` | Main application + form |
| `lib/supabase.ts` | Supabase client |
| `styles/modern.css` | Styling |
| `SUPABASE_MIGRATION.sql` | Database migration |
| `SUPABASE_SETUP.md` | Setup documentation |
| `QUICK_START.md` | This file |

---

## ✅ Deployment Checklist

- [x] App structure created
- [x] Supabase integration done
- [x] UI updated
- [x] GitHub Secrets set
- [ ] **NEXT**: Create database table (run SUPABASE_MIGRATION.sql)
- [ ] Test locally: `npm run dev`
- [ ] Push to GitHub: `git push origin main`
- [ ] Wait 2-3 min for GitHub Actions
- [ ] Visit: https://yourvz.github.io/bukutamu/

---

## 🧪 Testing Steps

### Local Testing
```bash
# Make sure .env.local has Supabase credentials
npm run dev

# Visit http://localhost:3000/bukutamu
# Fill form and submit
# Check data in Supabase dashboard
```

### Production Testing
```bash
# Push to GitHub (GitHub Actions auto-runs)
git push origin main

# Wait 2-3 minutes
# Visit https://yourvz.github.io/bukutamu/
# Test form submission
```

---

## 📋 Form Data Flow

```
User fills form
    ↓
Click "Daftarkan Kunjungan"
    ↓
Validate fields
    ↓
Try insert to Supabase
    ├─ Success → Reload list from DB
    └─ Error → Save to local state (offline mode)
    ↓
Reset form
    ↓
Show success message
    ↓
Display in visitor list
```

---

## 🔍 Debugging Tips

### Form not submitting?
- Check browser console (F12 → Console tab)
- Verify Supabase credentials in `.env.local`
- Check network tab for API errors

### Data not appearing?
- Verify table `tamu` exists in Supabase
- Check RLS policies are enabled
- Confirm data is in Supabase dashboard

### Build fails?
```bash
rm -rf .next node_modules
npm install
npm run build
```

---

## 📊 Database Query Examples

### Get all tamu
```sql
SELECT * FROM tamu ORDER BY waktu_kunjungan DESC;
```

### Get statistics
```sql
SELECT * FROM get_tamu_statistics();
```

### Get daily summary
```sql
SELECT * FROM statistik_harian;
```

---

## 🎯 Next Steps

1. **Run SQL migration** in Supabase SQL Editor (copy from `SUPABASE_MIGRATION.sql`)
2. **Test locally**: `npm run dev`
3. **Push to GitHub**: `git push origin main`
4. **Verify deployment**: Check GitHub Actions
5. **Test live site**: https://yourvz.github.io/bukutamu/

---

## 📞 Quick Reference

| Need | Link/Command |
|------|------|
| Supabase Console | https://app.supabase.com |
| GitHub Secrets | https://github.com/yourvz/bukutamu/settings/secrets/actions |
| GitHub Actions | https://github.com/yourvz/bukutamu/actions |
| Live Site | https://yourvz.github.io/bukutamu/ |
| Dev Server | `npm run dev` |
| Build | `npm run build` |

---

## ✨ Features Included

✅ Real-time database with Supabase  
✅ Form validation  
✅ Offline fallback mode  
✅ Responsive design  
✅ Error handling  
✅ Auto CI/CD deployment  
✅ Row Level Security (RLS)  
✅ Timestamp tracking  

---

**Ready to go!** 🚀

Follow the checklist above dan aplikasi akan live di:
→ https://yourvz.github.io/bukutamu/
