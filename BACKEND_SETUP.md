# Backend Setup Guide

This guide will help you set up the Laravel backend for the Luna AI application.

## Prerequisites

- **PHP 8.1 or higher** - [Download PHP](https://www.php.net/downloads.php)
- **Composer** - [Download Composer](https://getcomposer.org/download/)
- **Node.js 18+** - [Download Node.js](https://nodejs.org/)

## Quick Start

### 1. Install Dependencies

```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies (for frontend)
npm install
```

### 2. Environment Configuration

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 3. Database Setup

```bash
# Run migrations
php artisan migrate

# Seed the database with initial data
php artisan db:seed
```

### 4. Start the Backend Server

**For local development only:**
```bash
php artisan serve
```

**For mobile device access (recommended):**
```bash
php artisan serve --host=0.0.0.0 --port=8000
```

### 5. Start the Frontend

```bash
# In a separate terminal
npm run dev
```

## Mobile Device Access

To access the application from mobile devices on the same network:

1. **Find your computer's IP address:**
   - Windows: `ipconfig`
   - Mac/Linux: `ifconfig` or `ip addr`

2. **Start the backend with network access:**
   ```bash
   php artisan serve --host=0.0.0.0 --port=8000
   ```

3. **Access from mobile devices:**
   - Frontend: `http://[YOUR_IP]:3000`
   - Backend: `http://[YOUR_IP]:8000`

## Troubleshooting

### "Cannot connect to server" Error

This error occurs when the Laravel backend is not running. To fix:

1. **Check if the backend is running:**
   ```bash
   curl http://localhost:8000/api/health
   ```

2. **Start the backend:**
   ```bash
   php artisan serve --host=0.0.0.0 --port=8000
   ```

3. **Verify the backend is accessible:**
   - Open `http://localhost:8000` in your browser
   - You should see the Laravel welcome page

### Port Already in Use

If port 8000 is already in use:

```bash
# Use a different port
php artisan serve --host=0.0.0.0 --port=8001
```

Then update the frontend configuration accordingly.

### Database Connection Issues

1. **Check your database configuration in `.env`:**
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=luna_ai
   DB_USERNAME=root
   DB_PASSWORD=
   ```

2. **Create the database:**
   ```sql
   CREATE DATABASE luna_ai;
   ```

3. **Run migrations:**
   ```bash
   php artisan migrate
   ```

## Development Scripts

### Windows (start-dev.bat)
```bash
# Double-click start-dev.bat or run:
start-dev.bat
```

### Mac/Linux (start-dev.sh)
```bash
# Make executable and run:
chmod +x start-dev.sh
./start-dev.sh
```

## API Endpoints

The backend provides the following main API endpoints:

- `GET /api/health` - Health check
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/packages` - Get available packages
- `GET /api/dashboard/data` - Dashboard data
- `GET /api/admin/dashboard` - Admin dashboard data

## Production Deployment

For production deployment:

1. **Set up a proper web server** (Apache/Nginx)
2. **Configure SSL certificates**
3. **Set up a production database**
4. **Update environment variables**
5. **Run optimizations:**
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

## Support

If you encounter any issues:

1. Check the Laravel logs: `storage/logs/laravel.log`
2. Verify all prerequisites are installed
3. Ensure ports 3000 and 8000 are available
4. Check firewall settings for mobile device access

## Common Commands

```bash
# Clear all caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Reset database
php artisan migrate:fresh --seed

# Generate API documentation
php artisan api:docs

# Run tests
php artisan test
```
