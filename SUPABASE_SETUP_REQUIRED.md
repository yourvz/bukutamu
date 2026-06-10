# ⚠️ URGENT: Supabase Configuration Required

**Status**: 🔴 APPLICATION BLOCKED - Database Connection Failed  
**Date**: 2026-06-11  
**Issue**: Supabase credentials are not valid or database is unavailable

---

## 🔴 CURRENT ISSUE

The application is trying to connect to Supabase but getting:
- ❌ **URL Error**: `requested path is invalid`
- ❌ **API Error**: `Unauthorized`

This means one of the following:
1. Supabase project doesn't exist or was deleted
2. API keys are incorrect or expired
3. Supabase project is inactive
4. Network/firewall issue

---

## ✅ SOLUTION: Update Supabase Credentials

### Step 1: Create/Verify Supabase Project
1. Go to: https://app.supabase.com
2. Sign in or create account
3. Create a new project or use existing
4. Wait for project to initialize (2-5 minutes)

### Step 2: Get API Keys
1. In Supabase dashboard, go to: **Settings → API**
2. Copy the following:
   - **Project URL**: e.g., `https://xxxxx.supabase.co`
   - **Anon Public Key**: `sb_publicable_xxxxx`
   - **Service Role Key**: `eyJhbGciOi...` (long JWT token)

### Step 3: Update Environment Files
**File: `.env`**
```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT_URL.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_YOUR_ANON_KEY
VITE_SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

**File: `.env.production`**  
(Copy same values as `.env`)

### Step 4: Create Database Table
In Supabase SQL Editor, run:
```sql
CREATE TABLE IF NOT EXISTS public.tamu (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama TEXT NOT NULL,
  telepon TEXT NOT NULL,
  dari TEXT DEFAULT 'umum',
  nama_instansi TEXT,
  keperluan TEXT NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  waktu_kunjungan TIMESTAMP DEFAULT now(),
  created_at TIMESTAMP DEFAULT now()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.tamu ENABLE ROW LEVEL SECURITY;

-- Allow public INSERT
CREATE POLICY "Allow public insert" ON public.tamu
  FOR INSERT WITH CHECK (true);

-- Allow public SELECT own records
CREATE POLICY "Allow public select" ON public.tamu
  FOR SELECT USING (true);
```

### Step 5: Rebuild and Deploy
```bash
# Test locally first
npm run build

# Commit changes
git add .env .env.production src/
git commit -m "🔐 Update Supabase credentials for active project"

# Deploy
git push origin main
```

---

## 🧪 Verify Configuration

### Test 1: Check .env Variables
```bash
cat .env | grep VITE_SUPABASE
```

Expected output:
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_xxxxx
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

### Test 2: Check Supabase Connectivity
```bash
# Test project URL
curl https://xxxxx.supabase.co/rest/v1/ \
  -H "apikey: sb_publishable_xxxxx"

# Expected: Should not return "Unauthorized"
```

### Test 3: Test From Browser
1. Open: https://yourvz.github.io/bukutamu/
2. Check browser console (F12)
3. Should see: `✅ Supabase client initialized successfully`
4. Should NOT see: `❌ Supabase configuration missing`

---

## 📋 Checklist Before Going Live

- [ ] Supabase project created and active
- [ ] API keys copied correctly (no extra spaces/quotes)
- [ ] `.env` file updated with new credentials
- [ ] `.env.production` file updated (same as .env)
- [ ] Database table `tamu` created with correct schema
- [ ] RLS policies configured to allow public INSERT
- [ ] Tested connectivity with curl command
- [ ] Built application: `npm run build`
- [ ] Committed changes to git
- [ ] Pushed to GitHub: `git push origin main`
- [ ] Waited 2-3 minutes for GitHub Pages to update
- [ ] Tested application in browser
- [ ] Filled test form and verified data in Supabase

---

## 🔐 Important Security Notes

### Frontend vs Backend Keys
- **Anon Key**: Safe to expose in frontend (limited permissions)
- **Service Role Key**: Should NOT be exposed (has full admin access)
  - Currently in frontend for bypass RLS - ⚠️ NOT RECOMMENDED for production
  - Better approach: Move form submission to backend API

### RLS Policies
- Must configure Row Level Security in Supabase
- Set up policies to allow public INSERT only for `tamu` table
- Prevent users from accessing other tables

### Production Best Practices
1. Create backend API endpoint for form submission
2. Move Service Role Key to backend only
3. Use Anon Key in frontend with restrictive RLS policies
4. Add rate limiting to prevent spam
5. Add reCAPTCHA verification

---

## 🆘 Troubleshooting

### Error: "Unauthorized"
- API key is wrong or expired
- Try generating new keys in Supabase dashboard

### Error: "requested path is invalid"
- URL is wrong or incomplete
- Verify URL matches your Supabase project

### Error: "Table not found"
- Create `tamu` table in Supabase
- Run SQL commands provided above

### Form won't submit
- Check browser console for errors
- Verify RLS policies allow public INSERT
- Test connectivity with curl

---

## 📞 Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Dashboard**: https://app.supabase.com
- **Error Logs**: Check browser console (F12)
- **GitHub Repository**: https://github.com/yourvz/bukutamu

---

## ✅ After Fixing

Once Supabase is configured:
1. ✅ Application will load successfully
2. ✅ Form will be displayed
3. ✅ Submissions will save to database
4. ✅ Works on mobile devices
5. ✅ No "Sistem Sedang Error" message

---

**NEXT STEPS**:
1. Create Supabase project (2-5 minutes)
2. Copy API credentials
3. Update `.env` and `.env.production`
4. Run tests
5. Push to GitHub
6. Wait for GitHub Pages to update
7. Test application

**Priority**: 🔴 **HIGH** - Application is blocked without this configuration

---

**Last Updated**: 2026-06-11  
**Status**: Awaiting Supabase Credential Update
