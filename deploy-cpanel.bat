@echo off
REM LunaLuna AI - cPanel Deployment Script for Windows
REM This script prepares your Next.js app for cPanel deployment

echo 🚀 Starting LunaLuna AI cPanel deployment preparation...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ✗ Node.js is not installed. Please install Node.js first.
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ✗ npm is not installed. Please install npm first.
    exit /b 1
)

echo ✓ Node.js and npm are available

REM Install dependencies
echo ✓ Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ✗ Failed to install dependencies
    exit /b 1
)

REM Create production environment file if it doesn't exist
if not exist ".env.production" (
    echo ⚠ Creating .env.production file...
    (
        echo NODE_ENV=production
        echo HOSTNAME=localhost
        echo PORT=3000
        echo NEXT_PUBLIC_API_URL=http://localhost:3000/api
    ) > .env.production
    echo ✓ .env.production file created
) else (
    echo ✓ .env.production file already exists
)

REM Build the application
echo ✓ Building application for production...
call npm run build:production
if %errorlevel% neq 0 (
    echo ✗ Build failed
    exit /b 1
)

REM Create deployment directory
set DEPLOY_DIR=cpanel-deploy
echo ✓ Creating deployment directory: %DEPLOY_DIR%

if exist "%DEPLOY_DIR%" (
    rmdir /s /q "%DEPLOY_DIR%"
)

mkdir "%DEPLOY_DIR%"

REM Copy necessary files
echo ✓ Copying files to deployment directory...

REM Copy all files except excluded ones
xcopy /E /I /H /Y /EXCLUDE:exclude.txt . "%DEPLOY_DIR%\"

REM Create exclude.txt file for xcopy
(
    echo node_modules\
    echo .git\
    echo .next\
    echo cpanel-deploy\
    echo .env.local
    echo .env.development
    echo *.log
    echo .DS_Store
    echo Thumbs.db
) > exclude.txt

REM Copy .next directory (built files)
if exist ".next" (
    xcopy /E /I /H /Y .next "%DEPLOY_DIR%\.next\"
    echo ✓ Copied .next directory
)

REM Copy node_modules for production
echo ✓ Installing production dependencies in deployment directory...
cd "%DEPLOY_DIR%"
call npm install --production
cd ..

REM Create deployment instructions
(
    echo LunaLuna AI - cPanel Deployment Instructions
    echo ==========================================
    echo.
    echo 1. Upload all files in this directory to your cPanel public_html folder
    echo.
    echo 2. In cPanel Node.js Selector:
    echo    - Create a new Node.js application
    echo    - Set Application root to: /public_html
    echo    - Set Application startup file to: server.js
    echo    - Set Node.js version to: Latest LTS
    echo.
    echo 3. Set environment variables in cPanel:
    echo    - NODE_ENV=production
    echo    - HOSTNAME=yourdomain.com
    echo    - PORT=3000
    echo.
    echo 4. Start the application
    echo.
    echo 5. Configure your domain to point to the cPanel hosting
    echo.
    echo 6. Set up SSL certificate in cPanel
    echo.
    echo For detailed instructions, see CPANEL_DEPLOYMENT.md
    echo.
    echo Files included in this deployment:
    echo - server.js (Node.js server)
    echo - package.json (Dependencies)
    echo - .next/ (Built Next.js files)
    echo - public/ (Static assets including .htaccess)
    echo - All source code files
) > "%DEPLOY_DIR%\DEPLOYMENT_INSTRUCTIONS.txt"

echo ✓ Deployment package created in: %DEPLOY_DIR%

REM Clean up
del exclude.txt

echo.
echo 🎉 Deployment preparation complete!
echo.
echo Next steps:
echo 1. Upload the contents of '%DEPLOY_DIR%' to your cPanel public_html folder
echo 2. Follow the instructions in DEPLOYMENT_INSTRUCTIONS.txt
echo 3. Or read the detailed guide in CPANEL_DEPLOYMENT.md
echo.
echo Happy deploying! 🚀
pause
