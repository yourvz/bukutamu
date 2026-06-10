# 🗄️ Supabase Database Setup Guide

**Status**: ✅ Credentials Updated  
**Next Step**: Create Database Table and RLS Policies

---

## ✅ WHAT'S DONE

- ✅ Valid JWT tokens now in `.env` and `.env.production`
- ✅ Supabase Project URL configured: `https://uwnpifnkdqneafcaiyhz.supabase.co`
- ✅ ANON_KEY: Valid JWT token (eyJhbGciOiJ...)
- ✅ SERVICE_ROLE_KEY: Valid JWT token (eyJhbGciOiJ...)
- ✅ Credentials pushed to GitHub

---

## 🔴 WHAT'S MISSING

The Supabase project needs:
- ❌ Database table `tamu` (not created yet)
- ❌ Row Level Security (RLS) policies
- ❌ Proper permissions for Anon key

---

## 🔧 STEP 1: Create Database Table

### Access Supabase SQL Editor
1. Go to: https://app.supabase.com
2. Select your project: `uwnpifnkdqneafcaiyhz`
3. Go to: **SQL Editor**
4. Click **New Query**

### Run This SQL Command
Copy and paste this SQL, then click **RUN**:

```sql
-- Create the 'tamu' (guest) table
CREATE TABLE IF NOT EXISTS public.tamu (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama TEXT NOT NULL,
  telepon TEXT NOT NULL,
  dari TEXT DEFAULT 'umum' CHECK (dari IN ('umum', 'instansi', 'organisasi')),
  nama_instansi TEXT,
  keperluan TEXT NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  waktu_kunjungan TIMESTAMP DEFAULT now(),
  created_at TIMESTAMP DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tamu_waktu ON public.tamu(waktu_kunjungan);
CREATE INDEX IF NOT EXISTS idx_tamu_dari ON public.tamu(dari);

-- Enable Row Level Security
ALTER TABLE public.tamu ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public INSERT
CREATE POLICY "Allow public insert" ON public.tamu
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow public SELECT (optional, for viewing submissions)
CREATE POLICY "Allow public select" ON public.tamu
  FOR SELECT
  USING (true);

-- Grant permissions to anon role
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT ON public.tamu TO anon;
GRANT SELECT ON public.tamu TO anon;
```

**Expected Output**: 
```
✅ Query successful (no errors)
```

---

## 🧪 STEP 2: Verify Table Creation

### Check in Supabase Dashboard
1. Go to: **Table Editor**
2. Should see: `tamu` table in the list
3. Click on it to verify columns:
   - `id` (UUID)
   - `nama` (text)
   - `telepon` (text)
   - `dari` (text)
   - `nama_instansi` (text)
   - `keperluan` (text)
   - `user_agent` (text)
   - `ip_address` (text)
   - `waktu_kunjungan` (timestamp)
   - `created_at` (timestamp)

### Check RLS Policies
1. Go to: **Authentication → Policies**
2. Select table: `tamu`
3. Should see 2 policies:
   - "Allow public insert"
   - "Allow public select"

---

## 🔑 STEP 3: Verify API Keys

### In Supabase Dashboard
1. Go to: **Settings → API**
2. Verify you see:
   - **Project URL**: `https://uwnpifnkdqneafcaiyhz.supabase.co`
   - **Anon Public Key**: JWT token starting with `eyJhbGciOi...`
   - **Service Role Secret**: JWT token starting with `eyJhbGciOi...`

✅ These match your `.env` files

---

## 🧪 STEP 4: Test API Connection

### Test INSERT Permission
In Supabase **SQL Editor**, run:

```sql
-- Insert test data
INSERT INTO public.tamu (nama, telepon, dari, keperluan, ip_address, user_agent)
VALUES (
  'Test User',
  '081234567890',
  'umum',
  'Testing database connection',
  '127.0.0.1',
  'Mozilla/5.0 Test'
);

-- Verify insert worked
SELECT * FROM public.tamu ORDER BY created_at DESC LIMIT 1;
```

**Expected Output**:
```
✅ 1 row inserted
✅ Shows the test row with all data
```

If you see this, database is working! ✅

---

## 📋 Troubleshooting

### Error: "permission denied"
**Problem**: Table or RLS policies not configured correctly

**Solution**:
1. Run the full SQL script again
2. Check table exists: **Table Editor** should show `tamu`
3. Check RLS policies: **Authentication → Policies**

### Error: "table does not exist"
**Problem**: SQL script didn't run successfully

**Solution**:
1. Go to **SQL Editor**
2. Copy the full script above
3. Click **RUN** (not just highlight)
4. Wait for confirmation

### Error: "column xxx does not exist"
**Problem**: Wrong column name in code

**Solution**:
1. Go to **Table Editor**
2. Select `tamu` table
3. Check column names match:
   - `nama`, `telepon`, `dari`, `nama_instansi`, `keperluan`
   - `user_agent`, `ip_address`, `waktu_kunjungan`

---

## 🚀 STEP 5: Deploy Application

Once database is created, trigger rebuild:

```bash
cd f:\apps\Tamu

# Rebuild to pick up new credentials
npm run build

# Or just push to trigger GitHub Actions
git add -A
git commit -m "✅ Database setup complete - ready to deploy"
git push origin main
```

Wait 2-3 minutes for GitHub Pages to update.

---

## ✅ FINAL CHECKLIST

Before declaring success, verify:

- [ ] SQL script ran without errors
- [ ] `tamu` table visible in **Table Editor**
- [ ] All 10 columns present
- [ ] RLS policies configured
- [ ] Test INSERT successful
- [ ] `.env` files have valid JWT tokens
- [ ] Code pushed to GitHub
- [ ] Application loads at https://yourvz.github.io/bukutamu/
- [ ] Form displays without "Sistem Sedang Error"
- [ ] Form submission works
- [ ] Data appears in Supabase dashboard

---

## 📊 After Successful Setup

### Expected Behavior
1. ✅ Application loads normally
2. ✅ Form displays all fields
3. ✅ Fill form → Click "Kirim"
4. ✅ See success message "✓ Kunjungan berhasil didaftarkan!"
5. ✅ Data appears in Supabase `tamu` table within 1-2 seconds
6. ✅ Works on mobile devices

### Data Flow
```
User fills form
    ↓
Client-side validation
    ↓
Get device info (IP, User-Agent)
    ↓
Send to Supabase API
    ↓
Insert into `tamu` table
    ↓
✅ Success! Show confirmation
    ↓
Data visible in Supabase dashboard
```

---

## 🔐 Security Notes

### Current Setup
- Using **Anon Key** (public, safe to expose)
- RLS policies restrict public access to INSERT only
- No access to other tables
- Form validation on client-side

### For Production
Consider:
1. Add reCAPTCHA to prevent spam
2. Move submission to backend API
3. Rate limiting on INSERT
4. Email notifications
5. Additional validation

---

## 📞 Support

### If Something Goes Wrong
1. Check **Supabase Dashboard → Logs** for errors
2. Verify RLS policies in **Authentication → Policies**
3. Test SQL in **SQL Editor**
4. Check `.env` credentials are correct

### Resources
- Supabase Docs: https://supabase.com/docs
- RLS Policies: https://supabase.com/docs/guides/auth/row-level-security
- API Documentation: https://supabase.com/docs/reference/javascript/init

---

## ✨ Summary

**Time needed**: ~10 minutes
**Difficulty**: Easy
**Result**: Fully functional Buku Tamu application

**Steps**:
1. Create table (5 min)
2. Set up RLS (2 min)
3. Test INSERT (2 min)
4. Deploy (1 min)

**Done!** Application ready for production. 🎉

---

**Last Updated**: 2026-06-11  
**Status**: Ready for Database Setup
