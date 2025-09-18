#!/bin/bash

# LunaLuna AI - cPanel Deployment Script
# This script prepares your Next.js app for cPanel deployment

echo "🚀 Starting LunaLuna AI cPanel deployment preparation..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "Node.js and npm are available"

# Install dependencies
print_status "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    print_error "Failed to install dependencies"
    exit 1
fi

# Create production environment file if it doesn't exist
if [ ! -f ".env.production" ]; then
    print_warning "Creating .env.production file..."
    cat > .env.production << EOF
NODE_ENV=production
HOSTNAME=localhost
PORT=3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
EOF
    print_status ".env.production file created"
else
    print_status ".env.production file already exists"
fi

# Build the application
print_status "Building application for production..."
npm run build:production

if [ $? -ne 0 ]; then
    print_error "Build failed"
    exit 1
fi

# Create deployment directory
DEPLOY_DIR="cpanel-deploy"
print_status "Creating deployment directory: $DEPLOY_DIR"

if [ -d "$DEPLOY_DIR" ]; then
    rm -rf "$DEPLOY_DIR"
fi

mkdir "$DEPLOY_DIR"

# Copy necessary files
print_status "Copying files to deployment directory..."

# Copy all files except excluded ones
rsync -av --exclude='node_modules' \
         --exclude='.git' \
         --exclude='.next' \
         --exclude='cpanel-deploy' \
         --exclude='.env.local' \
         --exclude='.env.development' \
         --exclude='*.log' \
         --exclude='.DS_Store' \
         --exclude='Thumbs.db' \
         . "$DEPLOY_DIR/"

# Copy .next directory (built files)
if [ -d ".next" ]; then
    cp -r .next "$DEPLOY_DIR/"
    print_status "Copied .next directory"
fi

# Copy node_modules for production
print_status "Installing production dependencies in deployment directory..."
cd "$DEPLOY_DIR"
npm install --production
cd ..

# Create deployment instructions
cat > "$DEPLOY_DIR/DEPLOYMENT_INSTRUCTIONS.txt" << EOF
LunaLuna AI - cPanel Deployment Instructions
==========================================

1. Upload all files in this directory to your cPanel public_html folder

2. In cPanel Node.js Selector:
   - Create a new Node.js application
   - Set Application root to: /public_html
   - Set Application startup file to: server.js
   - Set Node.js version to: Latest LTS

3. Set environment variables in cPanel:
   - NODE_ENV=production
   - HOSTNAME=yourdomain.com
   - PORT=3000

4. Start the application

5. Configure your domain to point to the cPanel hosting

6. Set up SSL certificate in cPanel

For detailed instructions, see CPANEL_DEPLOYMENT.md

Files included in this deployment:
- server.js (Node.js server)
- package.json (Dependencies)
- .next/ (Built Next.js files)
- public/ (Static assets including .htaccess)
- All source code files

Total size: $(du -sh "$DEPLOY_DIR" | cut -f1)
EOF

print_status "Deployment package created in: $DEPLOY_DIR"
print_status "Total size: $(du -sh "$DEPLOY_DIR" | cut -f1)"

echo ""
echo "🎉 Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. Upload the contents of '$DEPLOY_DIR' to your cPanel public_html folder"
echo "2. Follow the instructions in DEPLOYMENT_INSTRUCTIONS.txt"
echo "3. Or read the detailed guide in CPANEL_DEPLOYMENT.md"
echo ""
echo "Happy deploying! 🚀"
