#!/bin/bash

# Production Deployment Script for Lunaluna AI
set -e

echo "🚀 Starting production deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required environment variables are set
if [ -z "$NODE_ENV" ]; then
    export NODE_ENV=production
fi

print_status "Environment: $NODE_ENV"

# Clean previous builds
print_status "Cleaning previous builds..."
npm run clean

# Install dependencies
print_status "Installing dependencies..."
npm ci --only=production

# Run type checking
print_status "Running TypeScript type checking..."
npm run type-check

# Run linting
print_status "Running ESLint..."
npm run lint

# Build the application
print_status "Building application for production..."
npm run build:production

# Generate sitemap
print_status "Generating sitemap..."
npm run postbuild

# Check if build was successful
if [ -d ".next" ]; then
    print_status "✅ Build completed successfully!"
    
    # Display build information
    print_status "Build size:"
    du -sh .next
    
    print_status "Static files:"
    du -sh .next/static
    
    print_status "Ready for deployment!"
else
    print_error "❌ Build failed!"
    exit 1
fi

# Optional: Start the production server for testing
if [ "$1" = "--start" ]; then
    print_status "Starting production server..."
    npm run start:production
fi

print_status "🎉 Deployment script completed!"
