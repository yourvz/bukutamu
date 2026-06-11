# �배 Deployment Guide - Buku Tamu Digital

## ✅ Deployment Status

**Last Updated**: 2026-06-11  
**Status**: ✅ **LIVE** - https://yourvz.github.io/bukutamu/  
**Repository**: https://github.com/yourvz/bukutamu

## 🚀 Infrastructure

### Frontend Deployment
- **Platform**: GitHub Pages
- **Branch**: `gh-pages` (auto-deployed)
- **Build Tool**: Next.js 14
- **Base Path**: `/bukutamu/`

### CI/CD Pipeline
- **Service**: GitHub Actions
- **Workflow File**: `.github/workflows/deploy.yml`
- **Trigger**: Push to `main` branch
- **Build Time**: ~2-3 minutes

## 📋 Deployment Steps

### 1. Local Development
```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Verify at http://localhost:3000/bukutamu
```

### 2. Build for Production
```bash
# Build Next.js
npm run build

# This creates:
# - .next/ (server-side build artifacts)
# - Static HTML files for export
```

### 3. Push to GitHub
```bash
# Stage changes
git add .

# Commit
git commit -m "Feature: your feature description"

# Push to main (triggers GitHub Actions)
git push origin main
```

### 4. GitHub Actions (Automatic)
The workflow automatically:
1. ✅ Checks out code
2. ✅ Installs dependencies
3. ✅ Builds Next.js project
4. ✅ Exports static files
5. ✅ Deploys to `gh-pages` branch
6. ✅ Updates live site at https://yourvz.github.io/bukutamu/

## 🔐 Security - Environment Variables

### Public Variables (safe to commit)
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Secret Variables (GitHub Secrets)
Never commit these! Store in GitHub Settings → Secrets and variables:
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL` (if needed)
- API keys
- Credentials

### Setting GitHub Secrets
1. Go to: https://github.com/yourvz/bukutamu/settings/secrets/actions
2. Click "New repository secret"
3. Add variable name and value
4. Reference in workflow: `${{ secrets.SECRET_NAME }}`

## 🛠️ Configuration Files

| File | Purpose |
|------|---------|
| `next.config.js` | Next.js config with basePath `/bukutamu/` |
| `.env.example` | Template for environment variables |
| `.env.production` | Production environment settings |
| `.github/workflows/deploy.yml` | GitHub Actions workflow |
| `.nojekyll` | Tells GitHub Pages to skip Jekyll |

## 📊 Project Structure

```
bukutamu/
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions workflow
├── app/                          # Next.js 14 app directory
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles
├── styles/                      # CSS styling
│   └── modern.css               # Main stylesheet
├── lib/                         # Utilities
├── components/                  # React components
├── public/                      # Static assets
├── next.config.js               # Next.js configuration
├── tsconfig.json                # TypeScript config
├── package.json                 # Dependencies
├── .env.example                 # Environment template
├── .env.production              # Production config
├── .gitignore                   # Git ignore rules
└── README.md                    # Project documentation
```

## 🔄 Continuous Deployment Flow

```
┌─────────────────────┐
│   Local Development │
│   (npm run dev)     │
└──────────┬──────────┘
           │
           ▼
┌──────────────────────┐
│  Git Push to main    │
│  (git push origin)   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────┐
│  GitHub Actions Trigger  │
│  - Install deps          │
│  - Build (next build)    │
│  - Export (static HTML)  │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  Deploy to gh-pages      │
│  Auto-publish to:        │
│  yourvz.github.io/       │
│  bukutamu/               │
└──────────────────────────┘
```

## 🧪 Testing Before Deploy

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Build test
npm run build

# Start production build
npm start
```

## 🐛 Troubleshooting

### Build Fails
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall
rm -rf node_modules
npm install

# Try build again
npm run build
```

### Page Not Loading
1. Check if `/bukutamu/` is in URL
2. Check browser console for errors
3. Verify GitHub Actions workflow passed
4. Clear browser cache (Ctrl+Shift+Delete)

### Secrets Not Available
1. Confirm secrets are in GitHub Settings
2. Check workflow uses correct secret name
3. Ensure `.env` files are in `.gitignore`

## 📈 Performance Monitoring

- **Build Size**: Monitor in GitHub Actions logs
- **Page Speed**: Check with Lighthouse
- **Deployment Time**: ~2-3 minutes per build

## 🔗 Useful Links

- [GitHub Repository](https://github.com/yourvz/bukutamu)
- [Live Site](https://yourvz.github.io/bukutamu/)
- [GitHub Pages Docs](https://docs.github.com/pages)
- [GitHub Actions Docs](https://docs.github.com/actions)
- [Next.js Docs](https://nextjs.org/docs)

## 📝 Deployment Checklist

- [ ] Code tested locally (`npm run dev`)
- [ ] Build successful (`npm run build`)
- [ ] No secrets in commits
- [ ] Environment variables documented
- [ ] GitHub Secrets configured
- [ ] Workflow file is correct
- [ ] Ready to `git push origin main`

## 🎯 Next Steps

1. **Add Supabase Integration** (Optional)
   - Configure database
   - Add API endpoints
   - Update `.env` variables

2. **Custom Domain** (Optional)
   - Add CNAME file
   - Configure DNS
   - Update GitHub Pages settings

3. **SSL/TLS Certificate**
   - GitHub Pages provides free HTTPS
   - Already enabled for *.github.io

---

**Last Deployed**: 2026-06-11  
**Deploy Status**: ✅ SUCCESS  
**URL**: https://yourvz.github.io/bukutamu/
