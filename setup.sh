#!/bin/bash
set -e

echo "🎨 Morphism UI Playground - Setup"
echo "================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Install from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ required. Current: $(node -v)"
    exit 1
fi

echo "${GREEN}✓${NC} Node.js $(node -v)"

if ! command -v git &> /dev/null; then
    echo "⚠️  Git not found. Install from https://git-scm.com/"
fi

echo ""
echo "${BLUE}Setting up project...${NC}"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env.local if not exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local..."
    cat > .env.local << 'EOF'
# Local development environment
# Add your variables here
EOF
fi

echo ""
echo "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "  ${BLUE}npm run dev${NC}     - Start development server"
echo "  ${BLUE}npm run build${NC}   - Build for production"
echo "  ${BLUE}./deploy.sh${NC}     - Deploy to Vercel"
echo ""
echo "Read DEPLOYMENT_GUIDE.md for more options"
