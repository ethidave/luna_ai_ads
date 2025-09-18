# Complete Payment System API Endpoints Documentation

## Overview

This document outlines all API endpoints for the complete payment system including Stripe, PayPal, Razorpay, NowPayments (Crypto), and Flutterwave in the LunaLuna AI platform.

## Base URL

```
/api/admin
```

## Authentication

All endpoints require Bearer token authentication:

```
Authorization: Bearer {token}
```

## Payment Methods Supported

### 1. Stripe (Credit/Debit Cards)

- **Currencies**: USD, EUR, GBP, CAD, AUD, JPY, CNY, BRL, MXN
- **Features**: Cards, Digital Wallets, Bank Transfers, BNPL
- **Regions**: Global

### 2. PayPal (Digital Wallet)

- **Currencies**: USD, EUR, GBP, CAD, AUD, JPY, CNY, BRL, MXN
- **Features**: PayPal, Venmo, Credit Cards
- **Regions**: Global

### 3. Razorpay (India & International)

- **Currencies**: INR, USD, EUR, GBP
- **Features**: Cards, UPI, Net Banking, Wallets, EMI
- **Regions**: India, International

### 4. NowPayments (Cryptocurrency)

- **Cryptocurrencies**: BTC, ETH, USDT, USDC, LTC, BCH, XRP, ADA, DOT, MATIC
- **Features**: 200+ cryptocurrencies, Instant payments
- **Regions**: Global

### 5. Flutterwave (Africa & International)

- **Currencies**: NGN, USD, EUR, GBP, KES, GHS, ZAR, EGP
- **Features**: Cards, Bank Transfers, Mobile Money, QR Codes
- **Regions**: Africa, International

## Payment Settings Endpoints

### 1. Get All Payment Settings

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
    "nowpayments": {
      "apiKey": "np_...",
      "ipnSecret": "...",
      "sandboxMode": true,
      "enabled": true,
      "supportedCoins": [
        "BTC",
        "ETH",
        "USDT",
        "USDC",
        "LTC",
        "BCH",
        "XRP",
        "ADA",
        "DOT",
        "MATIC"
      ]
    },
    "flutterwave": {
      "publicKey": "FLWPUBK-...",
      "secretKey": "FLWSECK-...",
      "encryptionKey": "...",
      "webhookSecret": "...",
      "enabled": true,
      "supportedCurrencies": [
        "NGN",
        "USD",
        "EUR",
        "GBP",
        "KES",
        "GHS",
        "ZAR",
        "EGP"
      ]
    },
    "general": {
      "defaultCurrency": "USD",
      "testMode": true,
      "autoCapture": true,
      "refundPolicy": "7 days"
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
    "nowpayments": {
      "apiKey": "np_...",
      "ipnSecret": "...",
      "sandboxMode": true,
      "enabled": true
    },
    "flutterwave": {
      "publicKey": "FLWPUBK-...",
      "secretKey": "FLWSECK-...",
      "encryptionKey": "...",
      "webhookSecret": "...",
      "enabled": true
    },
    "general": {
      "defaultCurrency": "USD",
      "testMode": true,
      "autoCapture": true,
      "refundPolicy": "7 days"
    }
  }
}
```

## Payment Processing Endpoints

### 3. Process Payment

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

### 4. Create Crypto Payment (NowPayments)

```http
POST /api/payments/crypto/create
```

**Request Body:**

```json
{
  "amount": 0.001,
  "currencyFrom": "BTC",
  "currencyTo": "USD",
  "orderId": "order_123",
  "orderDescription": "LunaLuna AI Subscription",
  "ipnCallbackUrl": "https://yourapp.com/webhooks/nowpayments"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "paymentId": "np_...",
    "payAddress": "bitcoin_address_here",
    "priceAmount": 0.001,
    "priceCurrency": "BTC",
    "payAmount": 0.001,
    "payCurrency": "BTC",
    "orderId": "order_123",
    "orderDescription": "LunaLuna AI Subscription",
    "ipnCallbackUrl": "https://yourapp.com/webhooks/nowpayments",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### 5. Create Flutterwave Payment

```http
POST /api/payments/flutterwave/create
```

**Request Body:**

```json
{
  "amount": 1000,
  "currency": "NGN",
  "email": "customer@example.com",
  "txRef": "tx_123",
  "customer": {
    "name": "John Doe",
    "email": "customer@example.com",
    "phone": "+2348012345678"
  },
  "customizations": {
    "title": "LunaLuna AI",
    "description": "Subscription Payment",
    "logo": "https://yourapp.com/logo.png"
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "status": "success",
    "message": "Hosted Link",
    "data": {
      "link": "https://ravemodal-dev.herokuapp.com/v3/hosted/pay/...",
      "reference": "FLW_REF_..."
    }
  }
}
```

## Payment Testing Endpoints

### 6. Test Payment Gateway

```http
POST /api/admin/test-payment/{method}
```

**Parameters:**

- `method`: `stripe`, `paypal`, `razorpay`, `nowpayments`, or `flutterwave`

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

### 7. Test Crypto Payment (NowPayments)

```http
POST /api/admin/test-payment/nowpayments
```

**Response:**

```json
{
  "success": true,
  "message": "NowPayments test successful",
  "data": {
    "method": "nowpayments",
    "testedAt": "2024-01-15T10:30:00Z",
    "status": "connected",
    "details": {
      "supportedCoins": 200,
      "minAmount": 0.0001,
      "maxAmount": 1000
    }
  }
}
```

## Webhook Endpoints

### 8. Stripe Webhook

```http
POST /api/webhooks/stripe
```

**Headers:**

```
Stripe-Signature: t=1234567890,v1=signature
```

### 9. PayPal Webhook

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

### 10. Razorpay Webhook

```http
POST /api/webhooks/razorpay
```

**Headers:**

```
X-Razorpay-Signature: signature
```

### 11. NowPayments Webhook

```http
POST /api/webhooks/nowpayments
```

**Headers:**

```
X-NowPayments-Signature: signature
```

### 12. Flutterwave Webhook

```http
POST /api/webhooks/flutterwave
```

**Headers:**

```
X-Flutterwave-Signature: signature
```

## Payment Status & Management

### 13. Get Payment Status

```http
GET /api/payments/{paymentId}/status
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
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:35:00Z"
  }
}
```

### 14. Refund Payment

```http
POST /api/payments/{paymentId}/refund
```

**Request Body:**

```json
{
  "amount": 500,
  "reason": "requested_by_customer"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "refundId": "re_...",
    "amount": 500,
    "status": "succeeded",
    "createdAt": "2024-01-15T10:40:00Z"
  }
}
```

### 15. Get Payment Methods

```http
GET /api/payments/methods
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
        "fees": "2.9% + 30¢",
        "icon": "credit-card"
      },
      {
        "id": "paypal",
        "name": "PayPal",
        "enabled": true,
        "status": "active",
        "supportedCurrencies": ["USD", "EUR", "GBP"],
        "fees": "2.9% + fixed fee",
        "icon": "globe"
      },
      {
        "id": "razorpay",
        "name": "Razorpay",
        "enabled": true,
        "status": "active",
        "supportedCurrencies": ["INR", "USD"],
        "fees": "2% + ₹3",
        "icon": "shield"
      },
      {
        "id": "nowpayments",
        "name": "NowPayments",
        "enabled": true,
        "status": "active",
        "supportedCurrencies": ["BTC", "ETH", "USDT"],
        "fees": "0.5%",
        "icon": "coins"
      },
      {
        "id": "flutterwave",
        "name": "Flutterwave",
        "enabled": true,
        "status": "active",
        "supportedCurrencies": ["NGN", "USD", "EUR"],
        "fees": "1.4% + ₦50",
        "icon": "zap"
      }
    ]
  }
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

### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Internal Server Error",
  "message": "Payment processing failed"
}
```

## Implementation Notes

### Security

1. **API Keys**: Store all API keys encrypted
2. **Webhooks**: Verify webhook signatures
3. **PCI Compliance**: Follow PCI DSS guidelines
4. **HTTPS**: Use HTTPS for all endpoints
5. **Rate Limiting**: Implement proper rate limiting

### Testing

1. **Test Mode**: Use test keys for development
2. **Webhook Testing**: Use ngrok for local webhook testing
3. **Error Handling**: Test all error scenarios
4. **Currency Testing**: Test with different currencies

### Database Schema

#### Payment Transactions Table

```sql
CREATE TABLE payment_transactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    payment_id VARCHAR(100) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    amount DECIMAL(20,8) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    status VARCHAR(20) NOT NULL,
    customer_id VARCHAR(100),
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_payment_id (payment_id)
);
```

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

## Testing Cards & Accounts

### Stripe Test Cards

- **Success**: 4242424242424242
- **Decline**: 4000000000000002
- **Insufficient Funds**: 4000000000009995

### PayPal Test Accounts

- **Buyer**: sb-buyer@personal.example.com
- **Seller**: sb-seller@business.example.com

### Razorpay Test Cards

- **Success**: 4111111111111111
- **Decline**: 4000000000000002

### NowPayments Test

- **Test Mode**: Use sandbox API key
- **Test Coins**: Use testnet cryptocurrencies

### Flutterwave Test Cards

- **Success**: 4187427415564246
- **Decline**: 4000000000000002
