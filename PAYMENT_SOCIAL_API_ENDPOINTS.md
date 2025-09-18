# Payment & Social Media API Endpoints Documentation

## Overview

This document outlines the complete API endpoints for the payment system and social media functionality in the LunaLuna AI platform.

## Base URL

```
/api/admin
```

## Authentication

All endpoints require Bearer token authentication:

```
Authorization: Bearer {token}
```

## Payment System Endpoints

### 1. Get Payment Settings

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

### 2. Update Payment Settings

```http
POST /api/admin/payment-settings
```

**Request Body:**

```json
{
  "settings": {
    "stripe_public_key": "pk_test_...",
    "stripe_secret_key": "sk_test_...",
    "stripe_webhook_secret": "whsec_...",
    "stripe_enabled": true,
    "paypal_client_id": "AeA1QIZXiflr1-...",
    "paypal_client_secret": "EC...",
    "paypal_webhook_id": "8W...",
    "paypal_enabled": true,
    "razorpay_key_id": "rzp_test_...",
    "razorpay_key_secret": "...",
    "razorpay_webhook_secret": "...",
    "razorpay_enabled": true,
    "default_currency": "USD",
    "test_mode": true
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Payment settings updated successfully",
  "data": {
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### 3. Test Payment Gateway

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
    "status": "connected",
    "details": {
      "accountId": "acct_...",
      "balance": "$1,234.56",
      "currency": "usd"
    }
  }
}
```

### 4. Get Payment Methods

```http
GET /api/admin/payment-methods
```

**Response:**

```json
{
  "success": true,
  "data": {
    "methods": [
      {
        "id": "stripe",
        "name": "Stripe",
        "enabled": true,
        "status": "active",
        "supportedCurrencies": ["USD", "EUR", "GBP"],
        "fees": "2.9% + 30¢"
      },
      {
        "id": "paypal",
        "name": "PayPal",
        "enabled": true,
        "status": "active",
        "supportedCurrencies": ["USD", "EUR", "GBP"],
        "fees": "2.9% + fixed fee"
      },
      {
        "id": "razorpay",
        "name": "Razorpay",
        "enabled": false,
        "status": "inactive",
        "supportedCurrencies": ["INR"],
        "fees": "2% + ₹3"
      }
    ]
  }
}
```

### 5. Process Payment

```http
POST /api/payments/process
```

**Request Body:**

```json
{
  "amount": 1000,
  "currency": "USD",
  "paymentMethod": "stripe",
  "customerId": "cus_...",
  "description": "LunaLuna AI Subscription",
  "metadata": {
    "userId": "123",
    "subscriptionId": "sub_456"
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "paymentId": "pay_...",
    "status": "succeeded",
    "amount": 1000,
    "currency": "USD",
    "paymentMethod": "stripe",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

## Social Media Endpoints

### 6. Get Social Media Settings

```http
GET /api/admin/social-settings
```

**Response:**

```json
{
  "success": true,
  "data": {
    "facebook": "https://facebook.com/lunaai",
    "twitter": "https://twitter.com/lunaai",
    "linkedin": "https://linkedin.com/company/lunaai",
    "instagram": "https://instagram.com/lunaai",
    "youtube": "https://youtube.com/lunaai",
    "tiktok": "https://tiktok.com/@lunaai",
    "discord": "https://discord.gg/lunaai",
    "autoPost": true,
    "socialLogin": true
  }
}
```

### 7. Update Social Media Settings

```http
POST /api/admin/social-settings
```

**Request Body:**

```json
{
  "settings": {
    "facebook": "https://facebook.com/lunaai",
    "twitter": "https://twitter.com/lunaai",
    "linkedin": "https://linkedin.com/company/lunaai",
    "instagram": "https://instagram.com/lunaai",
    "youtube": "https://youtube.com/lunaai",
    "tiktok": "https://tiktok.com/@lunaai",
    "discord": "https://discord.gg/lunaai",
    "autoPost": true,
    "socialLogin": true
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Social media settings updated successfully",
  "data": {
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### 8. Get Social Media Analytics

```http
GET /api/admin/social-analytics
```

**Response:**

```json
{
  "success": true,
  "data": {
    "totalFollowers": 12500,
    "engagementRate": 4.2,
    "reach": 45200,
    "platforms": [
      {
        "name": "Facebook",
        "followers": 5000,
        "engagement": 3.8,
        "reach": 18000
      },
      {
        "name": "Twitter",
        "followers": 3000,
        "engagement": 5.2,
        "reach": 12000
      },
      {
        "name": "Instagram",
        "followers": 4500,
        "engagement": 4.5,
        "reach": 15200
      }
    ],
    "trends": {
      "followersGrowth": 12,
      "engagementGrowth": 0.8,
      "reachGrowth": 18
    }
  }
}
```

### 9. Post to Social Media

```http
POST /api/admin/social-post
```

**Request Body:**

```json
{
  "content": "Check out our new AI features!",
  "platforms": ["facebook", "twitter", "instagram"],
  "media": [
    {
      "type": "image",
      "url": "https://example.com/image.jpg"
    }
  ],
  "scheduledAt": "2024-01-15T15:00:00Z"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "postId": "post_123",
    "platforms": ["facebook", "twitter", "instagram"],
    "status": "scheduled",
    "scheduledAt": "2024-01-15T15:00:00Z"
  }
}
```

### 10. Social Media Login

```http
POST /api/auth/social-login
```

**Request Body:**

```json
{
  "provider": "google",
  "token": "google_oauth_token",
  "userInfo": {
    "id": "google_user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "picture": "https://example.com/avatar.jpg"
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "123",
      "email": "user@example.com",
      "name": "John Doe",
      "avatar": "https://example.com/avatar.jpg",
      "socialProvider": "google"
    },
    "token": "jwt_token_here",
    "expiresIn": 3600
  }
}
```

## Webhook Endpoints

### 11. Stripe Webhook

```http
POST /api/webhooks/stripe
```

**Headers:**

```
Stripe-Signature: t=1234567890,v1=signature
```

**Request Body:** Stripe webhook payload

**Response:**

```json
{
  "success": true,
  "message": "Webhook processed successfully"
}
```

### 12. PayPal Webhook

```http
POST /api/webhooks/paypal
```

**Headers:**

```
PayPal-Transmission-Id: transmission_id
PayPal-Cert-Id: cert_id
PayPal-Transmission-Sig: signature
PayPal-Transmission-Time: timestamp
```

**Request Body:** PayPal webhook payload

**Response:**

```json
{
  "success": true,
  "message": "Webhook processed successfully"
}
```

### 13. Razorpay Webhook

```http
POST /api/webhooks/razorpay
```

**Headers:**

```
X-Razorpay-Signature: signature
```

**Request Body:** Razorpay webhook payload

**Response:**

```json
{
  "success": true,
  "message": "Webhook processed successfully"
}
```

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": "Validation failed",
  "message": "Invalid payment method",
  "errors": {
    "amount": ["Amount must be greater than 0"],
    "currency": ["Invalid currency code"]
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

### 402 Payment Required

```json
{
  "success": false,
  "error": "Payment failed",
  "message": "Insufficient funds",
  "data": {
    "paymentId": "pay_...",
    "status": "failed",
    "reason": "insufficient_funds"
  }
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
  "message": "Payment processing failed"
}
```

## Implementation Notes

### Payment System

1. **Security**: All payment data is encrypted and PCI DSS compliant
2. **Webhooks**: Implement proper webhook signature verification
3. **Idempotency**: Use idempotency keys for payment requests
4. **Retries**: Implement exponential backoff for failed payments
5. **Logging**: Log all payment attempts for audit purposes
6. **Testing**: Use test mode for development and staging

### Social Media System

1. **Rate Limiting**: Respect platform API rate limits
2. **Authentication**: Use OAuth 2.0 for social media APIs
3. **Content Validation**: Validate content before posting
4. **Scheduling**: Implement proper scheduling for posts
5. **Analytics**: Cache analytics data for performance
6. **Error Handling**: Handle platform-specific errors gracefully

### Database Schema

#### Payment Settings Table

```sql
CREATE TABLE payment_settings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    provider VARCHAR(50) NOT NULL,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    encrypted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_provider_key (provider, setting_key)
);
```

#### Social Media Settings Table

```sql
CREATE TABLE social_media_settings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    platform VARCHAR(50) NOT NULL,
    url VARCHAR(500),
    enabled BOOLEAN DEFAULT FALSE,
    auto_post BOOLEAN DEFAULT FALSE,
    social_login BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_platform (platform)
);
```

#### Payment Transactions Table

```sql
CREATE TABLE payment_transactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    payment_id VARCHAR(100) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    status VARCHAR(20) NOT NULL,
    customer_id VARCHAR(100),
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_payment_id (payment_id)
);
```

## Testing

### Payment Testing

- Use Stripe test cards for testing
- Test all payment scenarios (success, failure, refund)
- Verify webhook handling
- Test currency conversion

### Social Media Testing

- Test OAuth flows
- Verify posting functionality
- Test analytics data retrieval
- Validate URL formats

## Security Considerations

1. **API Keys**: Store all API keys encrypted
2. **Webhooks**: Verify webhook signatures
3. **Rate Limiting**: Implement proper rate limiting
4. **CORS**: Configure CORS properly
5. **HTTPS**: Use HTTPS for all endpoints
6. **Input Validation**: Validate all input data
7. **Error Handling**: Don't expose sensitive information in errors
