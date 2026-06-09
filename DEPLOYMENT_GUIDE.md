# Buku Tamu - GitHub Pages Deployment Guide

## 🚀 Deployment Setup

This project is configured to automatically deploy to GitHub Pages whenever you push to the `main` branch.

### Prerequisites

- GitHub account with repository access
- Git installed on your machine
- Project already pushed to GitHub

### Automatic Deployment (Recommended)

The project includes a GitHub Actions workflow that automatically builds and deploys your site.

#### Steps:

1. **Ensure repository is public** (required for free GitHub Pages)
   - Go to your GitHub repository settings
   - Scroll to "Danger Zone"
   - Click "Change repository visibility" → Select "Public"

2. **Enable GitHub Pages**
   - Go to **Settings** → **Pages**
   - Under "Build and deployment":
     - Source: Select "Deploy from a branch" or "GitHub Actions"
     - If "Deploy from a branch": Select branch `main` and folder `/(root)`
   - Click "Save"

3. **Automatic deployment**
   - The `.github/workflows/deploy.yml` file will automatically trigger on push to `main`
   - Workflow will:
     - Install dependencies
     - Build the Vite project
     - Upload artifacts
     - Deploy to GitHub Pages

4. **Access your site**
   ```
   https://yourvz.github.io/bukutamu/
   ```

### Manual Build and Deploy

If you prefer to build locally and deploy manually:

```bash
# Build the project
npm run build

# The dist/ folder now contains the production-ready files
# Push to GitHub and enable GitHub Pages (see steps above)
```

### Build Configuration

The Vite configuration has been updated for GitHub Pages:

```typescript
// vite.config.ts
export default defineConfig({
  base: '/bukutamu/',  // Set to your repository name
  // ... rest of config
})
```

**Important**: The `base` path `/bukutamu/` must match your GitHub repository name!

If you rename the repository, update `vite.config.ts`:
```typescript
base: '/new-repo-name/',
```

## ⚙️ Environment Variables

For production deployment, you may need to configure environment variables:

1. Create `.env.production` in your project root:
   ```
   VITE_API_URL=https://your-api-domain.com
   ```

2. Reference in your code:
   ```typescript
   const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
   ```

## 🔄 Continuous Integration

The GitHub Actions workflow includes:

- **Node.js 18** runtime environment
- **npm ci** for dependency installation
- **npm run build** for production build
- **Vite** for bundling and optimization
- **Automatic artifact upload and deployment**

### Workflow File Location

```
.github/workflows/deploy.yml
```

### View Deployment Status

1. Go to your GitHub repository
2. Click on "Actions" tab
3. Select the most recent workflow run
4. Check logs for build details

## 📝 Important Notes

### Repository Visibility

GitHub Pages for free accounts requires a public repository. If your repository is private, GitHub Pages is only available with GitHub Pro.

### Base Path

The site will be available at: `https://yourvz.github.io/bukutamu/`

Not at: `https://yourvz.github.io/`

This is due to the `base: '/bukutamu/'` configuration in `vite.config.ts`.

### Build Output

- Local build: `npm run build` → creates `dist/` folder
- GitHub Actions: Automatically builds and deploys the `dist/` folder

### API Considerations

Since GitHub Pages is a static site host, API calls must be to an external backend. The current setup expects:
- Frontend: GitHub Pages
- Backend: Separate server (e.g., Heroku, Vercel, AWS, or your own server)

Update the API endpoint in your component:
```typescript
const apiUrl = 'https://your-backend-domain.com/api'
```

## 🐛 Troubleshooting

### Site not appearing after push

1. Check "Actions" tab for workflow errors
2. Ensure repository is public
3. Verify "GitHub Pages" is enabled in Settings → Pages
4. Wait 2-3 minutes for deployment

### Asset paths broken

- Verify `base: '/bukutamu/'` in `vite.config.ts`
- Check that all assets are referenced correctly in Vue components
- Use relative paths for assets

### CORS errors with backend API

- Configure CORS on your backend server
- Add GitHub Pages URL to CORS whitelist:
  ```
  https://yourvz.github.io
  ```

## 📚 Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#github-pages)

## 🎯 Next Steps

1. Push changes to `main` branch
2. Check "Actions" tab for workflow
3. Once workflow completes (✅ green checkmark)
4. Visit: `https://yourvz.github.io/bukutamu/`

---

**Deployment configured for**: GitHub Pages  
**Repository**: https://github.com/yourvz/bukutamu  
**Last updated**: 2026-06-09
