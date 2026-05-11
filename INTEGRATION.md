# 🚀 TopCar Miami Rental - Easy Integration Guide

## 🎯 Quick Copy-Paste (Single HTML File)
1. Copy `dist/index.html` (run `npm run build` first)
2. Paste into your website
3. Done! Self-contained, no dependencies.

## 📦 Full Project Integration

### Requirements
```
Vite 5+, React 18+, Three.js WebGPU (r167+)
Chrome/Edge/Safari 18+ (WebGPU required)
Node.js 18+
```

### 1. Install Dependencies
```bash
npm i motion three dat.gui stats-gl lucide-react
npm i -D vite @vitejs/plugin-react tailwindcss postcss autoprefixer
```

### 2. Copy Files
```
├── public/
│   └── models/
│       ├── 2025_lamborghini_urus_se.glb (12MB)
│       ├── rolls-royce_2020_mansory_wraith.glb (8MB) 
│       └── 2023_chevrolet_corvette_z06.glb (15MB)
├── src/
│   ├── App.tsx
│   ├── components/
│   │   └── Showcase.tsx  ← 3D hero (WebGPU)
│   └── index.css
├── tailwind.config.js
├── vite.config.ts
├── index.html
└── package.json (minimal)
```

### 3. Config Files
**tailwind.config.js** (copy as-is)
**vite.config.ts** (React + Tailwind)

### 4. Usage
```tsx
// Full page
import App from './App'
render(<App />)

// Hero showcase only  
import Showcase from './components/Showcase'
<Showcase />  // Scroll-triggered 3D sections
```

## ⚙️ Customization
- `Showcase.tsx` → `modelData[]`: Swap GLBs, positions/scales
- `App.tsx` → `sections[]`: Text/content per 3D model
- Colors → Tailwind classes / CSS vars

## 🎮 Controls (Dev Mode)
- Click **Edit Mode** (top-right) → dat.GUI model positioning
- **Save All** → Copies JSON settings to clipboard
- Edit `modelData` directly in code

## 📱 Responsive
- Mobile: 3D hidden, text-only
- Desktop: Full WebGPU experience
- Sections auto-scroll trigger

## 🚀 Production Build
```bash
npm run build
# → dist/ folder (static HTML/JS/CSS)
open dist/index.html  # Self-contained demo
```

## 🔧 Troubleshooting
**WebGPU errors**: Chrome Canary/Edge Beta, `chrome://flags/#enable-unsafe-webgpu`
**Model not loading**: Verify GLB paths in `public/models/`
**Performance**: Reduce `sampleCount: 2` in Showcase.tsx

**Total size**: ~45MB (models). CDN/host GLBs for production.

Ready to deploy! 💨

