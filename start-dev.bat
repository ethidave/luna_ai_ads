@echo off
echo Starting Luna AI Development Environment...
echo.

echo ========================================
echo  Luna AI Development Server Startup
echo ========================================
echo.

echo [1/3] Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js is installed

echo.
echo [2/3] Checking if PHP is installed...
php --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: PHP is not installed or not in PATH
    echo Please install PHP from https://www.php.net/downloads.php
    pause
    exit /b 1
)
echo ✓ PHP is installed

echo.
echo [3/3] Starting servers...
echo.

echo Starting Next.js frontend on port 3000...
start "Next.js Frontend" cmd /k "npm run dev"

echo Waiting 3 seconds before starting Laravel backend...
timeout /t 3 /nobreak >nul

echo Starting Laravel backend on port 8000...
echo NOTE: Make sure you're in the Laravel project directory!
echo.
echo If you see "Backend Not Running" error, run this command in your Laravel directory:
echo php artisan serve --host=0.0.0.0 --port=8000
echo.

echo ========================================
echo  Development servers are starting...
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8000
echo.
echo For mobile devices, use your computer's IP address:
echo Frontend: http://[YOUR_IP]:3000
echo Backend:  http://[YOUR_IP]:8000
echo.
echo Press any key to exit...
pause >nul
