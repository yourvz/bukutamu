# 🔧 Supabase Setup Guide - Buku Tamu Digital

## 📋 Overview

Aplikasi **Buku Tamu Digital** telah diintegrasikan dengan **Supabase** untuk menyimpan data pengunjung ke database PostgreSQL. Panduan ini menjelaskan cara setup Supabase untuk produksi.

---

## 🚀 Quick Start

### 1. Login ke Supabase
- Buka: https://app.supabase.com
- Login dengan akun Anda (atau buat yang baru jika belum ada)

### 2. Buat/Akses Project
- Project ID: `uwnpifnkdqneafcaiyhz` (existing)
- URL: `https://uwnpifnkdqneafcaiyhz.supabase.co`

### 3. Create Tamu Table
Buka **SQL Editor** di Supabase Dashboard dan jalankan script ini:

**File**: `SUPABASE_MIGRATION.sql` (sudah tersedia di repository)

Atau copy-paste SQL ini:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tamu table
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

-- Enable Row Level Security
ALTER TABLE tamu ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable insert for anonymous" ON tamu FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable select for all" ON tamu FOR SELECT USING (true);

-- Grant permissions
GRANT SELECT, INSERT ON tamu TO anon;
```

### 4. Get API Keys
Di Supabase Dashboard → Settings → API:
- Copy `Project URL`
- Copy `anon public key`
- Copy `service_role key` (jika diperlukan)

### 5. Set Environment Variables

#### Local Development (`.env.local`)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://uwnpifnkdqneafcaiyhz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

#### Production (GitHub Secrets)
Buka: https://github.com/yourvz/bukutamu/settings/secrets/actions

Add secrets:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (optional)

---

## 📊 Table Schema

### `tamu` Table

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | UUID | ❌ | GENERATED | Primary Key |
| `nama` | VARCHAR(255) | ❌ | - | Nama pengunjung |
| `telepon` | VARCHAR(20) | ❌ | - | No. telepon |
| `dari` | VARCHAR(20) | ❌ | 'umum' | Category: umum/instansi/organisasi |
| `nama_instansi` | VARCHAR(255) | ✅ | NULL | Instansi/Organisasi (optional) |
| `keperluan` | TEXT | ❌ | - | Deskripsi keperluan kunjungan |
| `waktu_kunjungan` | TIMESTAMP | ✅ | NOW() | Timestamp kunjungan |
| `ip_address` | VARCHAR(45) | ✅ | NULL | IP address pengunjung |
| `user_agent` | TEXT | ✅ | NULL | Browser/Device info |
| `created_at` | TIMESTAMP | ✅ | NOW() | Created timestamp |
| `updated_at` | TIMESTAMP | ✅ | NOW() | Updated timestamp |

---

## 🔒 Row Level Security (RLS)

### Policies

**1. Insert Policy - Public Form Submission**
```sql
CREATE POLICY "Enable insert for anonymous" ON tamu
  FOR INSERT 
  WITH CHECK (true);
```
- Memungkinkan siapa saja submit form tanpa login
- Cocok untuk public guest registration form

**2. Select Policy - View All Tamu Data**
```sql
CREATE POLICY "Enable select for all" ON tamu
  FOR SELECT 
  USING (true);
```
- Memungkinkan siapa saja melihat daftar pengunjung
- Data pengunjung publik (bukan sensitif)

### Status
- ✅ RLS Enabled
- ✅ Policies configured
- ✅ Public access allowed (no authentication needed)

---

## 🧪 Testing

### Test Insert Data
```bash
# Dari Next.js app atau Supabase console
POST /rest/v1/tamu?apikey=anon_key
{
  "nama": "Budi Santoso",
  "telepon": "081234567890",
  "dari": "umum",
  "nama_instansi": "PT Maju Jaya",
  "keperluan": "Mendatangi kantor untuk mengurus surat"
}
```

### Test Query Data
```bash
GET /rest/v1/tamu?apikey=anon_key
```

### Sample Insert (SQL)
```sql
INSERT INTO tamu (nama, telepon, dari, nama_instansi, keperluan) VALUES
('Budi Santoso', '081234567890', 'umum', NULL, 'Mendatangi kantor untuk mengurus surat'),
('Siti Nurhaliza', '082345678901', 'instansi', 'PT Maju Jaya', 'Kunjungan kerja sama bisnis'),
('Ahmad Wijaya', '083456789012', 'organisasi', 'OSIS SMA Negeri 1', 'Acara gathering pelajar');
```

---

## 📱 Application Integration

### Frontend Code
File: `app/page.tsx`

```typescript
import { supabase } from '@/lib/supabase';

// Load tamu data
const { data } = await supabase
  .from('tamu')
  .select('*')
  .order('waktu_kunjungan', { ascending: false });

// Insert tamu data
const { data, error } = await supabase
  .from('tamu')
  .insert([{
    nama: 'Budi Santoso',
    telepon: '081234567890',
    dari: 'umum',
    nama_instansi: 'PT Maju Jaya',
    keperluan: 'Mendatangi kantor untuk mengurus surat'
  }]);
```

### Client File
File: `lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## 🚨 Troubleshooting

### Issue: "RLS policy denies access"
**Solution:**
- Check RLS policies are set to `WITH CHECK (true)`
- Enable SELECT and INSERT policies
- Verify `enable row level security` is enabled

### Issue: "Table does not exist"
**Solution:**
- Verify table name is lowercase: `visitors`
- Run SQL migration again
- Check correct database is selected

### Issue: "CORS error"
**Solution:**
- In Supabase → Settings → API → CORS
- Add your domain to allowed origins
- For GitHub Pages: Add `https://yourvz.github.io`

### Issue: "Credentials not working"
**Solution:**
- Check `.env.local` has correct values
- Verify API keys from Supabase dashboard
- Ensure `NEXT_PUBLIC_` prefix for client-side vars

---

## 📈 Performance Optimization

### Index Creation
```sql
-- Existing index
CREATE INDEX idx_visitors_created_at ON visitors(created_at DESC);

-- For searching by email
CREATE INDEX idx_visitors_email ON visitors(email);

-- For searching by company
CREATE INDEX idx_visitors_company ON visitors(company);
```

### Query Optimization
```typescript
// Good - Limited results
.limit(50)
.order('created_at', { ascending: false })

// Add WHERE clause for filtering
.eq('purpose', 'meeting')
.like('company', '%Example%')
```

---

## 🔐 Security Best Practices

✅ **Implemented:**
- RLS enabled on visitors table
- Public INSERT policy (form submission)
- Public SELECT policy (view visitors)
- No authentication required for public access

⚠️ **Recommendations:**
- Add email verification before saving (optional)
- Implement rate limiting (optional)
- Add CAPTCHA for bot protection (optional)
- Regular backups enabled (Supabase default)

---

## 📝 Environment Variables Reference

### Required Variables
Set di `.env.local` untuk local development atau GitHub Secrets untuk production:

| Variable | Type | Example | Required | Purpose |
|----------|------|---------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | String | `https://xxxx.supabase.co` | ✅ Yes | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | String | `eyJxx...` | ✅ Yes | Anon public key |

### Optional Variables
| Variable | Type | Purpose |
|----------|------|---------|
| `SUPABASE_SERVICE_ROLE_KEY` | String | Server-side only (not used in this app) |
| `DATABASE_URL` | String | Alternative connection string |

**Note**: `NEXT_PUBLIC_` prefix berarti safe untuk expose di frontend. Jangan commit `.env.local`!

---

## 🛠️ Maintenance

### Backup Database
Supabase automatically backs up your database:
- Daily backups (automatic)
- Point-in-time recovery available
- Manual backups can be downloaded

### Monitor Usage
Supabase Dashboard → Logs & Analytics:
- View API requests
- Monitor query performance
- Check database size

### Update RLS Policies
If you need to restrict access later:

```sql
-- Example: Only allow authenticated users
CREATE POLICY "Allow authenticated users" ON visitors
  FOR SELECT
  USING (auth.role() = 'authenticated');
```

---

## 📚 Useful Links

| Resource | Link |
|----------|------|
| Supabase Dashboard | https://app.supabase.com |
| Supabase Docs | https://supabase.com/docs |
| Supabase JS Client | https://supabase.com/docs/reference/javascript |
| PostgreSQL Docs | https://www.postgresql.org/docs/ |
| RLS Documentation | https://supabase.com/docs/guides/auth/row-level-security |

---

## 🎯 Deployment Checklist

- [ ] Supabase project created
- [ ] visitors table created with RLS
- [ ] RLS policies configured
- [ ] API keys copied
- [ ] `.env.local` updated (local dev)
- [ ] GitHub Secrets configured (production)
- [ ] Build tested locally (`npm run build`)
- [ ] Form tested in browser
- [ ] Data appears in Supabase dashboard
- [ ] Deployed to GitHub Pages
- [ ] Live site tested at https://yourvz.github.io/bukutamu/

---

## 🔗 Project Information

| Item | Value |
|------|-------|
| **Project** | Buku Tamu Digital |
| **Supabase URL** | https://uwnpifnkdqneafcaiyhz.supabase.co |
| **Repository** | https://github.com/yourvz/bukutamu |
| **Live Site** | https://yourvz.github.io/bukutamu/ |
| **Framework** | Next.js 14 + React 18 |
| **Database** | PostgreSQL (Supabase) |

---

**Last Updated**: 2026-06-11  
**Status**: ✅ READY FOR SETUP  
**Next Step**: Create Supabase table and get API keys
