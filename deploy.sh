#!/bin/bash
set -e

echo "🚀 Morphism UI Playground - Deployment Script"
echo "=============================================="

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ required. Current: $(node -v)"
    exit 1
fi

echo "✓ Node.js $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run type check
echo "🔍 Type checking..."
npm run type-check || true

# Build
echo "🏗️  Building..."
npm run build

# Check if Vercel CLI is installed
if command -v vercel &> /dev/null; then
    echo "🌐 Deploying to Vercel..."
    vercel --prod
else
    echo "⚠️  Vercel CLI not found. Install with: npm i -g vercel"
    echo "📁 Static export available in ./dist"
fi

echo "✅ Done!"
