# Morphism UI - CLI Commands Reference

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (Next.js hot reload)
npm run dev
# → http://localhost:3000

# Build for production
npm run build

# Start production server
npm start

# Type check without emitting
npm run type-check

# Run ESLint
npm run lint
```

## Vercel CLI Commands

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy preview (staging URL)
vercel

# Deploy to production
vercel --prod

# Link existing project
vercel link

# Set environment variables
vercel env add VARIABLE_NAME

# Pull environment variables
vercel env pull .env.local

# List deployments
vercel list

# Remove deployment
vercel remove <deployment-url>
```

## Git Commands

```bash
# Initialize repository
git init

# Add all files
git add .

# Commit with conventional message
git commit -m "feat: add new morphism component"
git commit -m "fix: resolve spring physics bug"
git commit -m "docs: update deployment guide"

# Add remote origin
git remote add origin https://github.com/YOUR_USERNAME/morphism-ui.git

# Push to main branch
git push -u origin main

# Create and switch to new branch
git checkout -b feature/new-component

# Merge branch
git checkout main
git merge feature/new-component

# Pull latest changes
git pull origin main

# View commit history
git log --oneline --graph
```

## Docker Commands

```bash
# Build Docker image
docker build -t morphism-ui .

# Run container
docker run -p 3000:3000 morphism-ui

# Run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

## Package Management

```bash
# Install specific package
npm install framer-motion

# Install dev dependency
npm install -D @types/react

# Update all packages
npm update

# Audit security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Clean install (remove node_modules first)
rm -rf node_modules package-lock.json
npm install

# Check outdated packages
npm outdated
```

## Troubleshooting Commands

```bash
# Clear Next.js cache
rm -rf .next

# Clear npm cache
npm cache clean --force

# Check Node.js version
node -v

# Check npm version
npm -v

# List global packages
npm list -g --depth=0

# Check port usage (macOS/Linux)
lsof -i :3000

# Kill process on port 3000
npx kill-port 3000
```

## Environment Setup

```bash
# Create local environment file
cat > .env.local << 'EOF'
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ANALYTICS_ID=
EOF

# Load environment variables
source .env.local
```

## Quick Deploy Checklist

```bash
# 1. Verify everything works locally
npm run dev

# 2. Type check
npm run type-check

# 3. Build locally first
npm run build

# 4. Check build output
ls -la dist/

# 5. Commit changes
git add .
git commit -m "deploy: prepare for production"
git push

# 6. Deploy
vercel --prod
```
