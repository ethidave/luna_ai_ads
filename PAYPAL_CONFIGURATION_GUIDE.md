# PayPal Configuration Guide

This guide will help you configure PayPal as a payment method in your Luna AI application.

## Overview

PayPal integration allows users to pay using:

- PayPal account balance
- Credit cards (Visa, Mastercard, American Express)
- Debit cards
- Bank accounts (where available)

## Prerequisites

1. PayPal Developer Account
2. PayPal Business Account
3. Valid domain name for webhook URLs

## Step 1: Create PayPal Application

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/applications)
2. Click "Create App"
3. Choose "Default Application" or "Custom Application"
4. Select "Sandbox" for testing or "Live" for production
5. Note down your Client ID and Client Secret

## Step 2: Configure Webhooks

1. In your PayPal app, go to "Webhooks" section
2. Click "Add Webhook"
3. Set webhook URL: `https://yourdomain.com/api/webhooks/paypal`
4. Select events:
   - `PAYMENT.CAPTURE.COMPLETED`
   - `PAYMENT.CAPTURE.DENIED`
   - `PAYMENT.CAPTURE.REFUNDED`
   - `CHECKOUT.ORDER.APPROVED`
   - `CHECKOUT.ORDER.VOIDED`
5. Note down your Webhook ID

## Step 3: Backend Configuration

### Laravel Backend Setup

1. Install PayPal SDK:

```bash
composer require paypal/rest-api-sdk-php
```

2. Add to `.env`:

```env
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_client_secret
PAYPAL_WEBHOOK_ID=your_webhook_id
PAYPAL_SANDBOX=true
PAYPAL_CURRENCY=USD
```

3. Create PayPal Service:

```php
// app/Services/PayPalService.php
<?php

namespace App\Services;

use PayPal\Rest\ApiContext;
use PayPal\Auth\OAuthTokenCredential;
use PayPal\Api\Amount;
use PayPal\Api\Details;
use PayPal\Api\Item;
use PayPal\Api\ItemList;
use PayPal\Api\Payer;
use PayPal\Api\Payment;
use PayPal\Api\RedirectUrls;
use PayPal\Api\Transaction;

class PayPalService
{
    private $apiContext;

    public function __construct()
    {
        $this->apiContext = new ApiContext(
            new OAuthTokenCredential(
                config('services.paypal.client_id'),
                config('services.paypal.client_secret')
            )
        );

        $this->apiContext->setConfig([
            'mode' => config('services.paypal.sandbox') ? 'sandbox' : 'live',
            'log.LogEnabled' => true,
            'log.FileName' => storage_path('logs/paypal.log'),
            'log.LogLevel' => 'DEBUG',
        ]);
    }

    public function createOrder($amount, $currency, $description, $returnUrl, $cancelUrl)
    {
        $payer = new Payer();
        $payer->setPaymentMethod('paypal');

        $item = new Item();
        $item->setName($description)
             ->setCurrency($currency)
             ->setQuantity(1)
             ->setPrice($amount);

        $itemList = new ItemList();
        $itemList->setItems([$item]);

        $amountObj = new Amount();
        $amountObj->setCurrency($currency)
                  ->setTotal($amount);

        $transaction = new Transaction();
        $transaction->setAmount($amountObj)
                   ->setItemList($itemList)
                   ->setDescription($description);

        $redirectUrls = new RedirectUrls();
        $redirectUrls->setReturnUrl($returnUrl)
                    ->setCancelUrl($cancelUrl);

        $payment = new Payment();
        $payment->setIntent('sale')
                ->setPayer($payer)
                ->setRedirectUrls($redirectUrls)
                ->setTransactions([$transaction]);

        try {
            $payment->create($this->apiContext);
            return [
                'success' => true,
                'orderId' => $payment->getId(),
                'approvalUrl' => $payment->getApprovalLink()
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    public function captureOrder($orderId)
    {
        try {
            $payment = Payment::get($orderId, $this->apiContext);
            $execution = new PaymentExecution();
            $execution->setPayerId(request('PayerID'));

            $result = $payment->execute($execution, $this->apiContext);

            return [
                'success' => true,
                'transactionId' => $result->getId()
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
}
```

4. Add Routes:

```php
// routes/api.php
Route::prefix('payments/paypal')->group(function () {
    Route::post('/create-order', [PayPalController::class, 'createOrder']);
    Route::post('/capture-order', [PayPalController::class, 'captureOrder']);
    Route::post('/cancel-order', [PayPalController::class, 'cancelOrder']);
    Route::get('/order/{orderId}', [PayPalController::class, 'getOrderDetails']);
    Route::post('/refund', [PayPalController::class, 'refund']);
    Route::get('/methods', [PayPalController::class, 'getMethods']);
    Route::post('/verify-webhook', [PayPalController::class, 'verifyWebhook']);
});

Route::post('/webhooks/paypal', [PayPalWebhookController::class, 'handle']);
```

## Step 4: Frontend Configuration

### Admin Settings

1. Go to Admin Panel → Settings → Payment Methods
2. Click on "PayPal" tab
3. Enter your PayPal credentials:
   - Client ID
   - Client Secret
   - Webhook ID
   - Webhook URL
4. Enable PayPal
5. Set sandbox mode for testing
6. Save settings

### Payment Flow

1. User selects PayPal as payment method
2. System creates PayPal order
3. User is redirected to PayPal
4. User completes payment on PayPal
5. PayPal redirects back to your app
6. System captures the order
7. Payment is processed

## Step 5: Testing

### Sandbox Testing

1. Use PayPal sandbox accounts
2. Test with different payment methods
3. Test success and failure scenarios
4. Verify webhook notifications

### Test Accounts

Create test accounts in PayPal Developer Dashboard:

- Personal Account (Buyer)
- Business Account (Merchant)

## Step 6: Production Setup

1. Switch to live mode
2. Update webhook URL to production domain
3. Use live credentials
4. Test with real PayPal accounts
5. Monitor webhook logs

## API Endpoints

### Create Order

```http
POST /api/payments/paypal/create-order
Content-Type: application/json

{
  "amount": 100.00,
  "currency": "USD",
  "description": "Package Purchase",
  "returnUrl": "https://yourdomain.com/dashboard?payment=success",
  "cancelUrl": "https://yourdomain.com/dashboard?payment=cancelled",
  "userId": 1,
  "packageId": 1
}
```

### Capture Order

```http
POST /api/payments/paypal/capture-order
Content-Type: application/json

{
  "orderId": "PAYID-XXXXXXXXXXXX"
}
```

### Webhook Handler

```http
POST /api/webhooks/paypal
Content-Type: application/json
PayPal-Transmission-Id: transmission_id
PayPal-Cert-Id: cert_id
PayPal-Transmission-Sig: signature
PayPal-Transmission-Time: timestamp

{
  "id": "WH-XXXXXXXXXXXX",
  "event_type": "PAYMENT.CAPTURE.COMPLETED",
  "resource": { ... }
}
```

## Security Considerations

1. Always verify webhook signatures
2. Use HTTPS for all webhook URLs
3. Store credentials securely
4. Implement proper error handling
5. Log all payment activities
6. Use environment variables for sensitive data

## Troubleshooting

### Common Issues

1. **Invalid Client ID/Secret**: Check credentials in PayPal dashboard
2. **Webhook not receiving**: Verify URL is accessible and returns 200
3. **Order creation fails**: Check amount format and currency
4. **Capture fails**: Verify order status and PayerID

### Debug Mode

Enable debug logging in PayPal service:

```php
'log.LogEnabled' => true,
'log.FileName' => storage_path('logs/paypal.log'),
'log.LogLevel' => 'DEBUG',
```

## Support

- PayPal Developer Documentation: https://developer.paypal.com/docs/
- PayPal Support: https://www.paypal.com/support
- Luna AI Support: support@lunaai.com

## Changelog

- v1.0.0: Initial PayPal integration
- v1.1.0: Added webhook verification
- v1.2.0: Added refund functionality
- v1.3.0: Added admin configuration panel
