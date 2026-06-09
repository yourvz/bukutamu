# 🚀 Buku Tamu - GitHub Pages Setup Instructions

Panduan lengkap untuk mengaktifkan dan mengakses aplikasi Buku Tamu di GitHub Pages.

## ✅ Quick Start (3 Langkah)

### 1. Buat Repository Public

```
GitHub → Repository Settings → Danger Zone → Make Public
```

Atau gunakan GitHub CLI:
```bash
gh repo edit yourvz/bukutamu --visibility public
```

### 2. Aktifkan GitHub Pages

```
GitHub → Settings → Pages
  ├─ Source: GitHub Actions (recommended)
  └─ Click "Save"
```

### 3. Tunggu Deployment

GitHub Actions akan otomatis:
1. Build project dengan Vite
2. Upload hasil build ke GitHub Pages
3. Deploy site dalam 2-3 menit

✅ **Selesai!** Site akan tersedia di: `https://yourvz.github.io/bukutamu/`

---

## 📋 Konfigurasi Detail

### Yang Sudah Dikonfigurasi:

✅ **vite.config.ts**
```typescript
base: '/bukutamu/',  // Sesuaikan dengan nama repository
```

✅ **.github/workflows/deploy.yml**
- Trigger otomatis saat push ke `main`
- Build dengan Node.js 18
- Deploy dengan GitHub Actions
- Upload artifacts ke GitHub Pages

✅ **.nojekyll**
- Memastikan GitHub Pages tidak menggunakan Jekyll
- Penting untuk Vue.js/Vite apps

---

## 🔍 Monitoring Deployment

### Cek Status Build:

1. Buka repository di GitHub
2. Klik tab **"Actions"**
3. Lihat workflow terbaru: `Deploy to GitHub Pages`
4. Status indicator:
   - 🟡 Yellow = Building
   - ✅ Green = Success
   - ❌ Red = Failed

### Lihat Logs:

```
Actions → Deploy to GitHub Pages → Click workflow run
→ Scroll ke bagian "Deploy to GitHub Pages"
```

---

## 🌐 Access Your Site

### URL Format:

```
https://[username].github.io/[repository-name]/
```

**Contoh:**
```
https://yourvz.github.io/bukutamu/
```

### Update Base Path

Jika repository name berubah, update `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/new-repo-name/',  // Change ini
  // ...
})
```

---

## ⚙️ Advanced Configuration

### Custom Domain (Optional)

Untuk gunakan domain custom (e.g., `bukutamu.com`):

1. **Create CNAME file**: `public/CNAME`
   ```
   bukutamu.com
   ```

2. **Configure DNS**: Arahkan ke GitHub Pages nameservers

3. **GitHub Settings → Pages**: Masukkan domain custom

### Build Output

```
Source: /src
  ↓ Build with Vite
Output: /dist
  ↓ Upload to GitHub Pages
Serve: https://yourvz.github.io/bukutamu/
```

---

## 🐛 Troubleshooting

### ❌ Workflow Failed

**Lihat logs:**
```
Actions → Failed run → Expand logs
```

**Solusi umum:**
- Pastikan `npm ci` berhasil (install dependencies)
- Check `npm run build` (build process)
- Verify `vite.config.ts` konfigurasi

### ❌ Site tidak muncul

1. Repository harus **public** (required)
2. Tunggu 2-3 menit setelah push
3. Hard refresh browser: `Ctrl+Shift+R` (Windows/Linux) atau `Cmd+Shift+R` (Mac)
4. Check Pages settings: Deployment source harus "GitHub Actions"

### ❌ Assets tidak load

**Masalah**: CSS/JS tidak muncul
**Solusi**: 
```typescript
// vite.config.ts - Pastikan base path benar
base: '/bukutamu/',
```

### ❌ CORS Error (API calls)

Jika backend terpisah, pastikan CORS configured:
```
Access-Control-Allow-Origin: https://yourvz.github.io
```

---

## 📊 Project Structure untuk Deployment

```
bukutamu/
├── .github/workflows/
│   └── deploy.yml              ✅ Auto deployment
├── src/
│   ├── App.vue                 ✅ Main component
│   ├── main.ts                 ✅ Entry point
│   └── style.css               ✅ Global styles
├── vite.config.ts              ✅ Base path configured
├── package.json                ✅ Build scripts
├── .nojekyll                   ✅ GitHub Pages config
├── DEPLOYMENT_GUIDE.md         📖 Detailed guide
└── dist/                       📦 Build output (auto-generated)
```

---

## 🔄 Update & Redeploy

### Setiap kali Anda update code:

```bash
# 1. Make changes to src/App.vue or other files
# 2. Test locally
npm run dev

# 3. Push to GitHub
git add .
git commit -m "Your changes"
git push origin main

# 4. GitHub Actions will automatically:
#    - Build project
#    - Deploy to GitHub Pages
#    - Site updated in 2-3 minutes
```

---

## 📈 Performance Tips

### Vite Optimizations (sudah configured):

✅ Code splitting (vendor bundle)
✅ Minification
✅ Source map disabled (production)
✅ Tree shaking

### Browser Caching:

GitHub Pages automatically handles caching. No additional config needed.

---

## 🔐 Security Notes

### GitHub Pages Best Practices:

✅ Don't commit `.env` files (use `.gitignore`)
✅ Use environment variables untuk sensitive data
✅ Never expose API keys in frontend code

### .gitignore Configuration:

Already configured dengan:
```
node_modules/
dist/
.env
.env.*.local
```

---

## 📞 Support & Resources

### Helpful Links:

- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Vue 3 Documentation](https://vuejs.org/)

### Workflow File Location:

```
.github/workflows/deploy.yml
```

Edit workflow jika perlu customization.

---

## ✨ Checklist

- [ ] Repository is public
- [ ] GitHub Pages enabled in Settings
- [ ] Workflow file exists: `.github/workflows/deploy.yml`
- [ ] `vite.config.ts` has correct `base` path
- [ ] Push to `main` branch
- [ ] Check Actions tab for build status
- [ ] Visit `https://yourvz.github.io/bukutamu/`
- [ ] Verify all pages load correctly
- [ ] Test responsive design (mobile/tablet)

---

## 🎉 Deployment Complete!

Site Anda sekarang live di GitHub Pages dengan automatic deployment!

**URL:** https://yourvz.github.io/bukutamu/

**Setiap push ke `main` branch akan automatically:**
1. Build project
2. Test build
3. Deploy ke GitHub Pages
4. Update live site

---

**Last Updated**: 2026-06-09  
**Status**: ✅ Configured and Ready
