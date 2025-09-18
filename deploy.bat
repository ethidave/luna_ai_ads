@echo off
REM Production Deployment Script for Lunaluna AI (Windows)

echo 🚀 Starting production deployment...

REM Set environment
if "%NODE_ENV%"=="" set NODE_ENV=production

echo [INFO] Environment: %NODE_ENV%

REM Clean previous builds
echo [INFO] Cleaning previous builds...
if exist .next rmdir /s /q .next
if exist out rmdir /s /q out
if exist dist rmdir /s /q dist

REM Install dependencies
echo [INFO] Installing dependencies...
call npm ci --only=production
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    exit /b 1
)

REM Run type checking
echo [INFO] Running TypeScript type checking...
call npm run type-check
if errorlevel 1 (
    echo [ERROR] TypeScript type checking failed
    exit /b 1
)

REM Run linting
echo [INFO] Running ESLint...
call npm run lint
if errorlevel 1 (
    echo [WARNING] ESLint found issues, but continuing...
)

REM Build the application
echo [INFO] Building application for production...
call npm run build:production
if errorlevel 1 (
    echo [ERROR] Build failed
    exit /b 1
)

REM Generate sitemap
echo [INFO] Generating sitemap...
call npm run postbuild

REM Check if build was successful
if exist .next (
    echo [INFO] ✅ Build completed successfully!
    echo [INFO] Ready for deployment!
) else (
    echo [ERROR] ❌ Build failed!
    exit /b 1
)

REM Optional: Start the production server for testing
if "%1"=="--start" (
    echo [INFO] Starting production server...
    call npm run start:production
)

echo [INFO] 🎉 Deployment script completed!
pause
