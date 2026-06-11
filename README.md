# 📋 Buku Tamu Digital - Next.js Version

**Live URL**: https://yourvz.github.io/bukutamu/  
**Repository**: https://github.com/yourvz/bukutamu  
**Status**: ✅ **PRODUCTION READY** (with Supabase integration)

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/yourvz/bukutamu.git
cd bukutamu
npm install
```

### 2. Setup Environment (Local Development)
```bash
# Copy template
cp .env.example .env.local

# Add your Supabase credentials
nano .env.local
```

Add these from your Supabase project:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Setup Supabase Database
See: [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for complete guide

Quick SQL for database creation:
```sql
CREATE TABLE visitors (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  purpose TEXT NOT NULL,
  company TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable insert" ON visitors FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable select" ON visitors FOR SELECT USING (true);
```

### 4. Run Development Server
```bash
npm run dev
```
Open http://localhost:3000/bukutamu

### 5. Deploy (Automatic)
```bash
git add .
git commit -m "Feature: your feature"
git push origin main
```
→ Automatically builds & deploys to https://yourvz.github.io/bukutamu/

---

## ✨ Features

✅ **Modern Tech Stack**
- Next.js 14 (React 18)
- TypeScript
- Supabase (PostgreSQL)
- GitHub Pages + GitHub Actions CI/CD

✅ **Functionality**
- Form pendaftaran pengunjung
- Database real-time dengan Supabase
- Daftar pengunjung terbaru
- Responsive mobile design
- Dark theme styling
- Offline fallback mode

✅ **Security**
- No hardcoded secrets
- Environment variables
- GitHub Secrets for production
- RLS enabled on database

✅ **Documentation**
- [DEPLOYMENT.md](DEPLOYMENT.md)
- [SUPABASE_SETUP.md](SUPABASE_SETUP.md)
- [MIGRATION_REPORT.md](MIGRATION_REPORT.md)

---

## 📁 Project Structure

```
bukutamu/
├── app/                         # Next.js 14 App Router
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Main page
│   └── globals.css             # Global styles
│
├── lib/
│   ├── supabase.ts             # Supabase client
│   └── utils.ts                # Utilities
│
├── styles/
│   └── modern.css              # Styling
│
├── .github/workflows/
│   └── deploy.yml              # CI/CD pipeline
│
├── docs/
│   ├── README.md               # This file
│   ├── DEPLOYMENT.md           # Deployment guide
│   ├── SUPABASE_SETUP.md       # Database setup
│   └── MIGRATION_REPORT.md     # Migration info
│
└── Configuration
    ├── next.config.js
    ├── tsconfig.json
    ├── package.json
    └── .env.example
```

---

## 📊 Build Metrics

| Metric | Value |
|--------|-------|
| Build Size | 153 kB (First Load JS) |
| Build Time | ~15-20s local, 2-3m CI |
| Pages | 4 static pages |
| Dependencies | 39 packages |
| Platform | GitHub Pages |

---

## 🛠️ Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm start            # Start production server
npm run type-check   # TypeScript check
npm run lint         # ESLint check
```

---

## 🔧 Technology Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14, React 18, TypeScript |
| Database | Supabase (PostgreSQL) |
| Hosting | GitHub Pages |
| CI/CD | GitHub Actions |
| Styling | CSS3 (responsive) |

---

## 🔐 Environment Variables

### Required (get from Supabase)
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Optional (for server-side only)
```env
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

### Production Setup
Set these in GitHub Secrets:
https://github.com/yourvz/bukutamu/settings/secrets/actions

---

## 🧪 Testing

### Local
```bash
npm run build
npm start
# Visit http://localhost:3000/bukutamu
```

### Production
```bash
git push origin main
# Wait 2-3 min for GitHub Actions
# Visit https://yourvz.github.io/bukutamu/
```

---

## 🐛 Troubleshooting

### Build Fails
```bash
rm -rf .next node_modules
npm install && npm run build
```

### Page Not Loading
- Check URL includes `/bukutamu/`
- Clear browser cache
- Check GitHub Actions logs

### Supabase Error
- Verify credentials in `.env.local`
- Check table exists in dashboard
- Verify RLS policies enabled

---

## 📚 Documentation

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - How to deploy
- **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** - Database setup guide
- **[MIGRATION_REPORT.md](MIGRATION_REPORT.md)** - Vite → Next.js migration

---

## 🔗 Links

- 📖 [GitHub Repository](https://github.com/yourvz/bukutamu)
- 🌐 [Live Site](https://yourvz.github.io/bukutamu/)
- 🔧 [Supabase Console](https://app.supabase.com)
- 📚 [Next.js Docs](https://nextjs.org/docs)
- 📖 [GitHub Pages Docs](https://docs.github.com/pages)

---

## 📝 Version History

### v2.0 - Next.js (Current) ✅
- Migrated from Vite + Vue 3
- Added Supabase integration
- Improved CI/CD pipeline
- Better documentation

### v1.0 - Vite + Vue 3 (Deprecated)
- Original implementation
- Migrated to v2.0

---

## 📞 Support

**Issues?** Check:
1. [SUPABASE_SETUP.md](SUPABASE_SETUP.md) - Database issues
2. [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment issues
3. GitHub Actions logs - Build errors
4. Browser console - Frontend errors

---

## 👤 Author

- **GitHub**: [@yourvz](https://github.com/yourvz)
- **Project**: Buku Tamu Digital
- **Version**: 2.0 (Next.js)
- **Last Updated**: 2026-06-11

---

✅ **Status**: PRODUCTION READY  
🚀 **Current Version**: 2.0 (Next.js 14 + Supabase)  
⚠️ **Previous Version**: 1.0 (deprecated)
