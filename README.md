# 📋 Buku Tamu Digital

Aplikasi pencatatan pengunjung modern yang dibangun dengan Next.js 14 dan React 18.

## 🚀 Fitur

- ✅ Form pendaftaran pengunjung
- ✅ Real-time visitor tracking
- ✅ Responsive design untuk mobile & desktop
- ✅ Modern UI dengan CSS styling
- ✅ Lightweight dan fast performance

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 + React 18
- **Styling**: CSS3
- **Deployment**: GitHub Pages + GitHub Actions

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm atau yarn
- Git

### Setup

1. **Clone repository**
```bash
git clone https://github.com/yourvz/bukutamu.git
cd bukutamu
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

Buka [http://localhost:3000/bukutamu](http://localhost:3000/bukutamu) di browser.

## 🏗️ Project Structure

```
bukutamu/
├── app/              # Next.js app directory
│   ├── layout.tsx    # Root layout
│   ├── page.tsx      # Home page
│   └── globals.css   # Global styles
├── styles/           # CSS styling
├── components/       # Reusable React components
├── lib/              # Utility functions
├── public/           # Static assets
├── next.config.js    # Next.js configuration
└── package.json      # Project dependencies
```

## 🔧 Available Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Export static files
npm run export

# Run linter
npm run lint
```

## 🚀 Deployment

### Deploy ke GitHub Pages

Deployment otomatis via GitHub Actions. Setiap push ke `main` branch akan:
1. Install dependencies
2. Build project
3. Deploy ke GitHub Pages di `gh-pages` branch

### Manual Deployment

```bash
npm run build
npm run export
```

Kemudian push ke `gh-pages` branch atau gunakan GitHub Actions.

## 📄 License

MIT

## 👥 Author

- [yourvz](https://github.com/yourvz)

## 🔗 Links

- [GitHub Repository](https://github.com/yourvz/bukutamu)
- [Live Demo](https://yourvz.github.io/bukutamu/)
- [Next.js Docs](https://nextjs.org/docs)

## 📝 Changelog

### v1.0.0 (2026-06-11)
- ✅ Migrasi dari Vite ke Next.js 14
- ✅ Simplified architecture tanpa external dependencies
- ✅ Responsive design dan modern UI
- ✅ Ready for Supabase integration
