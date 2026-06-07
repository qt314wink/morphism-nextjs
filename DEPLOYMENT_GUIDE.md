# Morphism UI Playground - Complete Deployment Guide

## Table of Contents
1. [Quick Deploy (One Command)](#quick-deploy)
2. [Vercel Deployment](#vercel-deployment)
3. [Git + Vercel Integration](#git-vercel)
4. [Static Export](#static-export)
5. [Docker Deployment](#docker)
6. [Troubleshooting](#troubleshooting)

---

## Quick Deploy (One Command)

```bash
# Clone/download the project, then:
cd morphism-nextjs
chmod +x deploy.sh
./deploy.sh
```

This script handles: dependency install → type check → build → Vercel deploy.

---

## Vercel Deployment

### Option A: Vercel CLI (Fastest)

```bash
# 1. Install Vercel CLI globally
npm install -g vercel

# 2. Login (first time only)
vercel login

# 3. Deploy to preview
vercel

# 4. Deploy to production
vercel --prod
```

### Option B: Vercel Dashboard (GUI)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub/GitLab/Bitbucket repo
3. Framework Preset: **Next.js**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Click **Deploy**

### Option C: Vercel + GitHub Actions (CI/CD)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        uses: vercel/action-deploy@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

Add these secrets to GitHub repo settings:
- `VERCEL_TOKEN` — from [vercel.com/account/tokens](https://vercel.com/account/tokens)
- `VERCEL_ORG_ID` — from project settings
- `VERCEL_PROJECT_ID` — from project settings

---

## Git + Vercel Integration

### Step 1: Initialize Git Repository

```bash
cd morphism-nextjs

# Initialize
git init

# Add all files
git add .

# First commit
git commit -m "Initial morphism UI playground"

# Add remote (replace with your repo)
git remote add origin https://github.com/YOUR_USERNAME/morphism-ui.git

# Push
git branch -M main
git push -u origin main
```

### Step 2: Connect to Vercel

```bash
# Using Vercel CLI
vercel

# Follow prompts:
# ? Set up and deploy? [Y/n] → Y
# ? Which scope? [your-username]
# ? Link to existing project? [y/N] → N
# ? What's your project name? [morphism-ui]
```

### Step 3: Auto-Deploy on Push

Once linked, every `git push` to `main` auto-deploys:

```bash
# Make changes
git add .
git commit -m "Add new component"
git push

# Vercel automatically builds and deploys
```

---

## Static Export

For hosting on Netlify, Cloudflare Pages, or any static host:

```bash
# Build static export
npm run build

# Output is in ./dist/
# - index.html
# - _next/ (JS/CSS assets)
# - All static files
```

### Netlify Drop (Drag & Drop)

1. Run `npm run build`
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag `./dist` folder
4. Site is live instantly

### Cloudflare Pages

```bash
# Install Wrangler
npm install -g wrangler

# Login
wrangler login

# Deploy
cd dist
wrangler pages deploy .
```

---

## Docker Deployment

Create `Dockerfile`:

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
EXPOSE 3000
CMD ["npx", "next", "start"]
```

Build and run:

```bash
# Build image
docker build -t morphism-ui .

# Run container
docker run -p 3000:3000 morphism-ui

# Or with Docker Compose
docker-compose up -d
```

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
```

---

## Troubleshooting

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next dist node_modules
rm package-lock.json
npm install
npm run build
```

### TypeScript Errors

```bash
# Check types without emitting
npm run type-check

# Skip type checking in build (not recommended)
# In next.config.js:
# typescript: { ignoreBuildErrors: true }
```

### Vercel Build Fails

1. Check Node.js version in Vercel settings → **18.x or 20.x**
2. Verify `vercel.json` exists in repo root
3. Check build logs for specific errors

### Audio Not Working

- Web Audio API requires user interaction first (click anywhere)
- Safari: may need `audioCtx.resume()` after interaction
- Check browser console for AudioContext errors

### Haptic Not Working

- Only works on mobile devices with vibration hardware
- Desktop browsers silently ignore `navigator.vibrate()`
- iOS Safari: requires user gesture

---

## Project Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (localhost:3000) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | TypeScript type checking |
| `vercel` | Deploy preview to Vercel |
| `vercel --prod` | Deploy production to Vercel |

---

## Environment Variables

Create `.env.local` for local development:

```env
# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your-id

# Optional: Custom domain
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

---

## Performance Checklist

- [ ] Images optimized (Next.js Image component)
- [ ] Fonts preloaded in layout.tsx
- [ ] Lazy loading for heavy components
- [ ] `will-change` on animated elements
- [ ] `prefers-reduced-motion` respected
- [ ] Web Audio context resumed on interaction
- [ ] Canvas animation paused when tab hidden

---

**Ready to deploy?** Run `./deploy.sh` or `vercel --prod`
