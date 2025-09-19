#!/bin/bash

echo "Starting Luna AI Development Environment..."
echo

echo "========================================"
echo "  Luna AI Development Server Startup"
echo "========================================"
echo

echo "[1/3] Checking if Node.js is installed..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed or not in PATH"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo "✓ Node.js is installed"

echo
echo "[2/3] Checking if PHP is installed..."
if ! command -v php &> /dev/null; then
    echo "ERROR: PHP is not installed or not in PATH"
    echo "Please install PHP from https://www.php.net/downloads.php"
    exit 1
fi
echo "✓ PHP is installed"

echo
echo "[3/3] Starting servers..."
echo

echo "Starting Next.js frontend on port 3000..."
npm run dev &
FRONTEND_PID=$!

echo "Waiting 3 seconds before starting Laravel backend..."
sleep 3

echo "Starting Laravel backend on port 8000..."
echo "NOTE: Make sure you're in the Laravel project directory!"
echo
echo "If you see 'Backend Not Running' error, run this command in your Laravel directory:"
echo "php artisan serve --host=0.0.0.0 --port=8000"
echo

echo "========================================"
echo "  Development servers are starting..."
echo "========================================"
echo
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8000"
echo
echo "For mobile devices, use your computer's IP address:"
echo "Frontend: http://[YOUR_IP]:3000"
echo "Backend:  http://[YOUR_IP]:8000"
echo

# Function to cleanup on exit
cleanup() {
    echo "Stopping servers..."
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Trap Ctrl+C
trap cleanup INT

# Wait for user input
echo "Press Ctrl+C to stop all servers..."
wait
