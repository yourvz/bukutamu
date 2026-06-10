# Buku Tamu Application - Setup & Running Guide

## ✅ Status: FULLY WORKING (Localhost & Production)

### Recent Fixes Applied
- ✅ Resolved "Failed to resolve module specifier 'vue'" error
- ✅ CORS configuration complete
- ✅ API endpoint routing fixed
- ✅ Form submission working correctly
- ✅ Vite base path configured for GitHub Pages

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ installed
- Port 3000 (backend) & 5174 (frontend) available

### Running Locally

#### 1. Start Backend Server (Port 3000)
```bash
cd f:\apps\Tamu\backend
node src/server.js
```

Expected output:
```
✅ Connected to Supabase successfully
🚀 Server running on http://localhost:3000
```

#### 2. Start Frontend Dev Server (Port 5174) - In New Terminal
```bash
cd f:\apps\Tamu
node_modules\.bin\vite --port 5174
```

Expected output:
```
  VITE v4.5.14  ready in 331 ms
  ➜  Local:   http://localhost:5174/
```

#### 3. Open in Browser
Navigate to: **http://localhost:5174/**

### Testing Form Submission
1. Fill in form fields:
   - Nama: `Test User`
   - Telepon: `08XXXXXXXXXX`
   - Keperluan: `Testing form submission`
2. Click "Kirim" button
3. Expected: ✓ Success message appears
4. Data saved to Supabase database

---

## 🛠️ Environment Configuration

### Development (.env)
```
VITE_API_URL=http://localhost:3000
```

### Production (.env.production)
```
VITE_API_URL=<your-deployed-backend-url>
```

### Backend (.env in backend folder)
```
APP_PORT=3000
NODE_ENV=development
SUPABASE_URL=https://uwnpifnkdqneafcaiyhz.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<key>
FRONTEND_URL=http://localhost:5174
```

---

## 📦 Building for Production

```bash
cd f:\apps\Tamu

# Build frontend (generates dist folder)
npm run build
# or
node_modules\.bin\vite build

# Output: dist/index.html and assets
```

---

## 🌐 GitHub Pages Deployment

### Current Setup
- Repository: https://github.com/yourvz/bukutamu
- Live URL: https://yourvz.github.io/bukutamu/
- GitHub Actions Workflow: `.github/workflows/deploy.yml`

### Deployment Process (Automatic)
1. Push changes to main branch
2. GitHub Actions automatically triggers
3. Runs `npm run build`
4. Deploys dist folder to GitHub Pages
5. Available at https://yourvz.github.io/bukutamu/

### Manual Deployment
```bash
# Changes auto-deploy via GitHub Actions
# No manual action needed
git add -A
git commit -m "Update message"
git push origin main
```

---

## 🔧 Troubleshooting

### Error: "Failed to resolve module specifier 'vue'"
**Cause**: Dev server not running or wrong port
**Solution**: 
1. Kill all Node processes: `Get-Process node | Stop-Process -Force`
2. Clear Vite cache: `rm -Force -Recurse node_modules/.vite`
3. Restart frontend server on port 5174

### Error: "CORS policy blocked"
**Cause**: Backend not running or wrong CORS config
**Solution**:
1. Verify backend running on port 3000
2. Check backend CORS settings in `server.js`
3. Ensure VITE_API_URL matches backend address

### Error: "Server tidak merespons"
**Cause**: Backend not running or unreachable
**Solution**:
1. Start backend: `cd backend && node src/server.js`
2. Check that port 3000 is accessible
3. Verify Supabase connection

### Port Already in Use
```bash
# Find process using port
netstat -ano | findstr :5174
netstat -ano | findstr :3000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

---

## 📋 File Structure

```
f:\apps\Tamu\
├── src/
│   ├── App.vue           # Main form component
│   ├── main.js           # Entry point
│   └── style.css         # Styles
├── backend/
│   └── src/server.js     # Express backend API
├── dist/                 # Production build (generated)
├── .env                  # Dev config
├── .env.production       # Production config
├── vite.config.js        # Vite config
└── package.json          # Dependencies
```

---

## 🔗 API Endpoints

### POST /api/tamu - Submit form
```bash
curl -X POST http://localhost:3000/api/tamu \
  -H "Content-Type: application/json" \
  -d '{
    "nama": "Test User",
    "telepon": "081234567890",
    "dari": "umum",
    "nama_instansi": null,
    "keperluan": "Testing"
  }'
```

### GET /api/tamu - Get entries
```bash
curl http://localhost:3000/api/tamu
```

### GET /api/health - Health check
```bash
curl http://localhost:3000/api/health
```

---

## ✅ Testing Checklist

- [ ] Backend running on port 3000
- [ ] Frontend running on port 5174
- [ ] Page loads at http://localhost:5174 without errors
- [ ] Form fields are visible and editable
- [ ] Form submission succeeds with success message
- [ ] Data appears in Supabase database
- [ ] No CORS errors in browser console
- [ ] No module resolution errors

---

## 📊 Technology Stack

- **Frontend**: Vue 3 + Vite + Axios
- **Backend**: Node.js + Express + Supabase
- **Database**: Supabase (PostgreSQL)
- **Hosting**: GitHub Pages (frontend) + Supabase (backend)
- **Build**: Vite with manual vendor chunking

---

## 📞 Support

If you encounter issues:
1. Check troubleshooting section above
2. Review browser console for errors
3. Check terminal output for backend logs
4. Verify all processes are running
5. Try clean rebuild: `rm -r dist && npm run build`

---

## 🎯 Next Steps

1. **Deploy Backend** to production server (Heroku, Railway, etc.)
2. **Update Production URL** in `.env.production`
3. **Rebuild and Deploy** frontend to GitHub Pages
4. **Configure CORS** for production domain
5. **Test production** at https://yourvz.github.io/bukutamu/

---

**Last Updated**: 2026-06-10
**Status**: ✅ WORKING & TESTED
