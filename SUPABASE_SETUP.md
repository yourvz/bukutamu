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

### 3. Create Visitors Table
Buka **SQL Editor** di Supabase Dashboard dan jalankan:

```sql
-- Create visitors table
CREATE TABLE visitors (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  purpose TEXT NOT NULL,
  company TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better performance
CREATE INDEX idx_visitors_created_at ON visitors(created_at DESC);

-- Enable Row Level Security
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

-- Create RLS policy untuk INSERT (public - tanpa auth)
CREATE POLICY "Enable insert for anonymous users" ON visitors
  FOR INSERT 
  WITH CHECK (true);

-- Create RLS policy untuk SELECT (public - tanpa auth)
CREATE POLICY "Enable select for all users" ON visitors
  FOR SELECT 
  USING (true);
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

### `visitors` Table

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | BIGINT | ❌ | GENERATED | Primary Key |
| `name` | TEXT | ❌ | - | Nama pengunjung |
| `phone` | TEXT | ❌ | - | No. telepon |
| `email` | TEXT | ❌ | - | Email address |
| `purpose` | TEXT | ❌ | - | Keperluan: meeting, service, survey, other |
| `company` | TEXT | ✅ | NULL | Instansi/Perusahaan (optional) |
| `created_at` | TIMESTAMP | ✅ | NOW() | Waktu kunjungan |

---

## 🔒 Row Level Security (RLS)

### Policies

**1. Insert Policy - Public Form Submission**
```sql
CREATE POLICY "Enable insert for anonymous users" ON visitors
  FOR INSERT 
  WITH CHECK (true);
```
- Memungkinkan siapa saja submit form tanpa login

**2. Select Policy - View All Visitors**
```sql
CREATE POLICY "Enable select for all users" ON visitors
  FOR SELECT 
  USING (true);
```
- Memungkinkan siapa saja melihat daftar pengunjung

### Status
- ✅ RLS Enabled
- ✅ Policies configured
- ✅ Public access allowed (no authentication needed)

---

## 🧪 Testing

### Test Insert Data
```bash
# Dari Next.js app atau Supabase console
POST /rest/v1/visitors?apikey=anon_key
{
  "name": "John Doe",
  "phone": "081234567890",
  "email": "john@example.com",
  "purpose": "meeting",
  "company": "PT Example"
}
```

### Test Query Data
```bash
GET /rest/v1/visitors?apikey=anon_key
```

---

## 📱 Application Integration

### Frontend Code
File: `app/page.tsx`

```typescript
import { supabase } from '@/lib/supabase';

// Load visitors
const { data } = await supabase
  .from('visitors')
  .select('*')
  .order('created_at', { ascending: false });

// Insert visitor
const { data, error } = await supabase
  .from('visitors')
  .insert([{
    name: 'John Doe',
    phone: '081234567890',
    email: 'john@example.com',
    purpose: 'meeting',
    company: 'PT Example'
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

| Variable | Type | Example | Required |
|----------|------|---------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | String | `https://...supabase.co` | ✅ Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | String | `eyJxx...` | ✅ Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | String | `eyJxx...` | ❌ No* |

*Service role key only needed if using Supabase Admin SDK on backend

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
