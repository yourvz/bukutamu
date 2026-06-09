# ⚠️ GitHub Pages - Troubleshooting Checklist

Jika halaman tidak tampil di `https://yourvz.github.io/bukutamu/`, ikuti checklist ini:

## ✅ Step 1: Verify Repository Settings

### 1.1 Make Repository Public

```
1. Go to: https://github.com/yourvz/bukutamu
2. Click: Settings (top right)
3. Scroll down: Danger Zone
4. Find: "Change repository visibility"
5. Click: "Make public"
6. Confirm password/2FA if prompted
```

**Status**: 
- [ ] Repository is PUBLIC
- [ ] Can verify by going to repo - should say "Public" badge

### 1.2 Check Visibility Status

```
Repository URL should show [PUBLIC] badge:
https://github.com/yourvz/bukutamu ← Should say "Public"
```

---

## ✅ Step 2: Enable GitHub Pages

### 2.1 Navigate to Pages Settings

```
1. Go to: https://github.com/yourvz/bukutamu
2. Click: Settings tab
3. Scroll left sidebar: Find "Pages"
4. Click: "Pages"
```

### 2.2 Configure Source

**Option A: GitHub Actions (Recommended)**
```
Build and deployment:
- Source: [GitHub Actions] ← Select this
```

**Option B: Deploy from a branch**
```
If you see "Deploy from a branch" option:
- Branch: main
- Folder: / (root)
```

### 2.3 Verify Configuration

```
After saving, you should see:
"Your site is published at https://yourvz.github.io/bukutamu/"
```

**Status**:
- [ ] Pages is ENABLED
- [ ] Source is configured (GitHub Actions OR main branch)
- [ ] URL shows in yellow/green box

---

## ✅ Step 3: Check GitHub Actions Workflow

### 3.1 Go to Actions Tab

```
1. https://github.com/yourvz/bukutamu
2. Click: Actions tab (top)
```

### 3.2 Look for Workflow Runs

**What you should see:**
- List of workflow runs
- Recent: "Deploy to GitHub Pages" workflows
- Status: ✅ Green (passed) or 🔴 Red (failed)

### 3.3 Check Latest Run Status

```
If you see RED (❌ Failed):
1. Click on the failed run
2. Expand "Build and Deploy" job
3. Check logs for errors
4. Look for:
   - npm install errors
   - npm run build errors
   - Deployment errors
```

**Status**:
- [ ] At least one workflow run exists
- [ ] Latest run is GREEN (✅ Success)
- [ ] If RED: Check logs and fix errors

---

## ✅ Step 4: Verify Built Files

### 4.1 Check dist/ Folder (Local)

```bash
# Build locally to verify it works
cd F:\apps\Tamu
npm run build

# Should create/update dist/ folder with:
# - index.html
# - assets/
```

**Files that should exist:**
```
dist/
├── index.html
├── assets/
│   ├── index-XXXXX.js
│   └── index-XXXXX.css
└── vite.svg
```

**Status**:
- [ ] `npm run build` completes successfully
- [ ] `dist/` folder is created
- [ ] `dist/index.html` exists

---

## ✅ Step 5: Test Local Build

### 5.1 Preview Built Site Locally

```bash
cd F:\apps\Tamu
npm run preview

# Should start local server, usually port 4173
# Open: http://localhost:4173/bukutamu/
```

### 5.2 Verify Styling

When preview opens, you should see:
- ✅ Left side: Office background image
- ✅ Right side: White form
- ✅ "Kantor Pusat" header
- ✅ Form fields styled
- ✅ "Kirim & Daftar Masuk" button

**Status**:
- [ ] Local preview works
- [ ] All styling visible
- [ ] No console errors

---

## ✅ Step 6: Force GitHub Actions Run

### 6.1 Make a Small Change

```bash
# Edit any file (e.g., README.md)
# Add a comment or small change

git add .
git commit -m "Trigger GitHub Actions deployment"
git push origin main
```

### 6.2 Monitor Workflow

```
Go to: Actions tab
Watch for new "Deploy to GitHub Pages" workflow
Should start within 1-2 seconds of push
```

### 6.3 Check Deployment Status

```
When workflow completes:
- ✅ Green checkmark = Success
- 🔴 Red X = Failed
- 🟡 Yellow = Still running
```

**Status**:
- [ ] Workflow triggered
- [ ] Workflow completed
- [ ] Workflow shows GREEN (✅)

---

## ✅ Step 7: Access GitHub Pages Site

### 7.1 Clear Browser Cache

```
Press: Ctrl + Shift + Delete (Windows/Linux)
       Cmd + Shift + Delete (Mac)
       
Or: Ctrl + Shift + R (hard refresh)
```

### 7.2 Visit URL

```
https://yourvz.github.io/bukutamu/
```

### 7.3 Verify Display

You should see:
- ✅ Page title: "Buku Tamu"
- ✅ Left side: Office background image
- ✅ Right side: Form with all fields
- ✅ No 404 errors
- ✅ All styling applied

**Status**:
- [ ] Page loads without 404
- [ ] Title says "Buku Tamu"
- [ ] Layout visible (2 columns on desktop)
- [ ] Styling applied correctly

---

## 🐛 Common Issues & Solutions

### ❌ Issue: 404 Not Found

**Causes:**
1. Repository is still private
2. GitHub Pages not enabled
3. Workflow hasn't run yet

**Solutions:**
1. [ ] Make repository public
2. [ ] Enable GitHub Pages in Settings → Pages
3. [ ] Wait 2-3 minutes for workflow
4. [ ] Check Actions tab - is workflow green?

### ❌ Issue: Blank White Page

**Causes:**
1. CSS/JS not loading (path issue)
2. Build incomplete
3. Cache issue

**Solutions:**
1. [ ] Hard refresh: `Ctrl + Shift + R`
2. [ ] Check browser console (F12) for errors
3. [ ] Verify `base: '/bukutamu/'` in vite.config.ts
4. [ ] Check Actions workflow - is it green?

### ❌ Issue: Styling Missing

**Causes:**
1. Base path incorrect
2. CSS file not building
3. Asset path issue

**Solutions:**
1. [ ] Verify vite.config.ts: `base: '/bukutamu/'`
2. [ ] Run locally: `npm run preview`
3. [ ] Check browser console (F12) for 404 errors
4. [ ] Rebuild: `npm run build`

### ❌ Issue: Workflow Failed (Red ❌)

**Steps:**
1. Click failed workflow
2. Expand "Build and Deploy"
3. Look for error messages:

**Common errors:**
- `npm ci failed` → Delete package-lock.json, retry
- `npm run build failed` → Run locally first, fix errors
- `Upload artifact failed` → Check dist/ folder exists
- `Deploy failed` → Check GitHub Pages settings

### ❌ Issue: Deployment Stuck (Yellow 🟡)

**Solution:**
- Wait 5-10 minutes
- If still stuck, click "Re-run jobs"

---

## 📊 Full Checklist

```
Repository Setup:
- [ ] Repository is PUBLIC
- [ ] GitHub Pages enabled in Settings → Pages
- [ ] Source set to GitHub Actions

Build Verification:
- [ ] npm run build works locally
- [ ] dist/ folder created with files
- [ ] npm run preview shows correct styling

GitHub Actions:
- [ ] At least one workflow run exists
- [ ] Latest workflow run is GREEN (✅)
- [ ] Check Actions tab for status

Live Site:
- [ ] https://yourvz.github.io/bukutamu/ loads
- [ ] No 404 errors
- [ ] Layout visible (2 columns)
- [ ] Styling applied
- [ ] No console errors
```

---

## 🔗 Helpful URLs

| Link | Purpose |
|------|---------|
| `https://github.com/yourvz/bukutamu/settings` | Repository Settings |
| `https://github.com/yourvz/bukutamu/settings/pages` | GitHub Pages Settings |
| `https://github.com/yourvz/bukutamu/actions` | GitHub Actions Runs |
| `https://yourvz.github.io/bukutamu/` | Your Live Site |

---

## 📞 Still Not Working?

Try these debugging steps:

### 1. Build Locally First

```bash
cd F:\apps\Tamu
npm run build
npm run preview
```

If this works → Issue is with GitHub Pages config
If this fails → Fix local build first

### 2. Check Console Errors

```
Open: https://yourvz.github.io/bukutamu/
Press: F12 (Developer Tools)
Check: Console tab for red errors
Check: Network tab for 404s
```

### 3. Force Clear Cache

```
Ctrl + Shift + R (hard refresh)
Or: Open in Incognito/Private mode
```

### 4. Re-run Workflow

```
Go to: Actions tab
Find: Latest "Deploy to GitHub Pages"
Click: "Re-run all jobs" button
Wait: 2-3 minutes for completion
```

### 5. Check vite.config.ts

```typescript
// Should have:
export default defineConfig({
  base: '/bukutamu/',  // ← Must be correct
  // ...
})
```

---

## ✅ When It's Working

You'll see:
- ✅ URL: `https://yourvz.github.io/bukutamu/`
- ✅ Title: "Buku Tamu"
- ✅ Left: Office image background
- ✅ Right: Form with styling
- ✅ No errors in console
- ✅ Responsive on mobile

---

**Last Updated**: 2026-06-09  
**Status**: Troubleshooting Guide v1.0
