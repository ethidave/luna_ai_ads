# Admin Settings API Endpoints Documentation

## Overview

This document outlines all the API endpoints required for the comprehensive admin settings functionality in the LunaLuna AI platform.

## Base URL

```
/api/admin
```

## Authentication

All endpoints require Bearer token authentication:

```
Authorization: Bearer {token}
```

## Settings Endpoints

### 1. Get All Settings

```http
GET /api/admin/settings
```

**Response:**

```json
{
  "success": true,
  "data": {
    "general": {
      "siteName": "LunaLuna AI",
      "adminEmail": "admin@lunaai.com",
      "timezone": "UTC",
      "language": "en",
      "siteDescription": "AI-powered advertising platform",
      "siteUrl": "https://lunaai.com",
      "supportEmail": "support@lunaai.com",
      "maintenanceMode": false
    },
    "security": {
      "twoFactor": true,
      "sessionTimeout": 30,
      "passwordMinLength": 8,
      "passwordRequireSpecial": true,
      "passwordRequireNumbers": true,
      "passwordRequireUppercase": true,
      "loginAttempts": 5,
      "lockoutDuration": 15,
      "ipWhitelist": ["192.168.1.1", "10.0.0.1"],
      "sslRequired": true,
      "cookieSecure": true,
      "csrfProtection": true
    },
    "notifications": {
      "email": {
        "enabled": true,
        "smtpHost": "smtp.gmail.com",
        "smtpPort": 587,
        "smtpUsername": "user@example.com",
        "smtpPassword": "encrypted_password",
        "smtpEncryption": "tls",
        "fromName": "LunaLuna AI",
        "fromEmail": "noreply@lunaai.com"
      },
      "sms": {
        "enabled": false,
        "provider": "twilio",
        "apiKey": "encrypted_key",
        "apiSecret": "encrypted_secret",
        "fromNumber": "+1234567890"
      },
      "push": {
        "enabled": true,
        "firebaseKey": "encrypted_key",
        "firebaseSecret": "encrypted_secret"
      },
      "admin": {
        "enabled": true,
        "newUserRegistration": true,
        "paymentReceived": true,
        "systemErrors": true,
        "securityAlerts": true
      }
    },
    "social": {
      "facebook": "https://facebook.com/lunaai",
      "twitter": "https://twitter.com/lunaai",
      "linkedin": "https://linkedin.com/company/lunaai",
      "instagram": "https://instagram.com/lunaai",
      "youtube": "https://youtube.com/lunaai",
      "tiktok": "https://tiktok.com/@lunaai",
      "discord": "https://discord.gg/lunaai"
    },
    "database": {
      "backupEnabled": true,
      "backupFrequency": "daily",
      "backupRetention": 30,
      "autoOptimize": true,
      "queryLogging": false,
      "slowQueryThreshold": 2000
    },
    "system": {
      "maxFileSize": 10,
      "allowedFileTypes": ["jpg", "jpeg", "png", "gif", "pdf", "doc", "docx"],
      "cacheEnabled": true,
      "cacheDuration": 3600,
      "compressionEnabled": true,
      "cdnEnabled": false,
      "cdnUrl": "",
      "monitoringEnabled": true,
      "logLevel": "info"
    },
    "api": {
      "rateLimitEnabled": true,
      "rateLimitRequests": 1000,
      "rateLimitWindow": 60,
      "apiKeyRequired": false,
      "corsEnabled": true,
      "corsOrigins": ["*"],
      "webhookRetries": 3,
      "webhookTimeout": 30
    },
    "theme": {
      "primaryColor": "#6366f1",
      "secondaryColor": "#8b5cf6",
      "accentColor": "#f59e0b",
      "darkMode": false,
      "customCss": "",
      "logoUrl": "https://example.com/logo.png",
      "faviconUrl": "https://example.com/favicon.ico"
    }
  }
}
```

### 2. Update Settings

```http
POST /api/admin/settings
```

**Request Body:**

```json
{
  "settings": {
    "general": { ... },
    "security": { ... },
    "notifications": { ... },
    "social": { ... },
    "database": { ... },
    "system": { ... },
    "api": { ... },
    "theme": { ... }
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Settings updated successfully",
  "data": {
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

## Payment Settings Endpoints

### 3. Get Payment Settings

```http
GET /api/admin/payment-settings
```

**Response:**

```json
{
  "success": true,
  "data": {
    "stripe": {
      "publicKey": "pk_test_...",
      "secretKey": "sk_test_...",
      "webhookSecret": "whsec_...",
      "enabled": true
    },
    "paypal": {
      "clientId": "AeA1QIZXiflr1-...",
      "clientSecret": "EC...",
      "webhookId": "8W...",
      "enabled": true
    },
    "razorpay": {
      "keyId": "rzp_test_...",
      "keySecret": "...",
      "webhookSecret": "...",
      "enabled": true
    },
    "general": {
      "defaultCurrency": "USD",
      "testMode": true
    }
  }
}
```

### 4. Update Payment Settings

```http
POST /api/admin/payment-settings
```

**Request Body:**

```json
{
  "settings": {
    "stripe": {
      "publicKey": "pk_test_...",
      "secretKey": "sk_test_...",
      "webhookSecret": "whsec_...",
      "enabled": true
    },
    "paypal": {
      "clientId": "AeA1QIZXiflr1-...",
      "clientSecret": "EC...",
      "webhookId": "8W...",
      "enabled": true
    },
    "razorpay": {
      "keyId": "rzp_test_...",
      "keySecret": "...",
      "webhookSecret": "...",
      "enabled": true
    },
    "general": {
      "defaultCurrency": "USD",
      "testMode": true
    }
  }
}
```

### 5. Test Payment Gateway

```http
POST /api/admin/test-payment/{method}
```

**Parameters:**

- `method`: `stripe`, `paypal`, or `razorpay`

**Response:**

```json
{
  "success": true,
  "message": "Payment gateway test successful",
  "data": {
    "method": "stripe",
    "testedAt": "2024-01-15T10:30:00Z",
    "status": "connected"
  }
}
```

## Database Management Endpoints

### 6. Create Database Backup

```http
POST /api/admin/database/backup
```

**Response:**

```json
{
  "success": true,
  "message": "Database backup created successfully",
  "data": {
    "backupId": "backup_20240115_103000",
    "filename": "backup_20240115_103000.sql",
    "size": "2.5MB",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### 7. List Database Backups

```http
GET /api/admin/database/backups
```

**Response:**

```json
{
  "success": true,
  "data": {
    "backups": [
      {
        "id": "backup_20240115_103000",
        "filename": "backup_20240115_103000.sql",
        "size": "2.5MB",
        "createdAt": "2024-01-15T10:30:00Z",
        "status": "completed"
      }
    ],
    "total": 1
  }
}
```

### 8. Download Database Backup

```http
GET /api/admin/database/backups/{backupId}/download
```

**Response:** Binary file download

## System Monitoring Endpoints

### 9. Get System Status

```http
GET /api/admin/system/status
```

**Response:**

```json
{
  "success": true,
  "data": {
    "server": {
      "status": "online",
      "uptime": "7 days, 12 hours",
      "memoryUsage": "65%",
      "cpuUsage": "23%",
      "diskUsage": "45%"
    },
    "database": {
      "status": "connected",
      "connections": 15,
      "queryTime": "2.3ms"
    },
    "cache": {
      "status": "active",
      "hitRate": "94%",
      "memoryUsage": "128MB"
    },
    "queue": {
      "status": "running",
      "pendingJobs": 5,
      "failedJobs": 0
    }
  }
}
```

### 10. Clear Cache

```http
POST /api/admin/system/cache/clear
```

**Response:**

```json
{
  "success": true,
  "message": "Cache cleared successfully",
  "data": {
    "clearedAt": "2024-01-15T10:30:00Z",
    "itemsCleared": 1250
  }
}
```

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": "Validation failed",
  "message": "Invalid input data",
  "errors": {
    "siteName": ["Site name is required"],
    "adminEmail": ["Invalid email format"]
  }
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "error": "Forbidden",
  "message": "Insufficient permissions"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## Implementation Notes

1. **Security**: All sensitive data (passwords, API keys) should be encrypted before storage
2. **Validation**: Implement comprehensive validation for all input data
3. **Rate Limiting**: Apply rate limiting to prevent abuse
4. **Logging**: Log all settings changes for audit purposes
5. **Backup**: Automatically backup settings before major changes
6. **Testing**: Implement test endpoints for all external integrations
7. **Caching**: Cache frequently accessed settings for performance
8. **Environment**: Support different settings for different environments (dev, staging, production)

## Database Schema

### Settings Table

```sql
CREATE TABLE admin_settings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    category VARCHAR(50) NOT NULL,
    key_name VARCHAR(100) NOT NULL,
    value TEXT,
    encrypted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_category_key (category, key_name)
);
```

### Settings History Table

```sql
CREATE TABLE admin_settings_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    setting_id BIGINT,
    old_value TEXT,
    new_value TEXT,
    changed_by BIGINT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (setting_id) REFERENCES admin_settings(id),
    FOREIGN KEY (changed_by) REFERENCES users(id)
);
```
