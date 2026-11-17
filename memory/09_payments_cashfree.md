# 09 — Payments & Cashfree

## Current Status: 🟢 Integrated (Cashfree Payments PG)

Migrated from Razorpay to **Cashfree Payments** using the official `cashfree-pg` (v6.x) backend SDK and Cashfree.js (v3) Drop-in Web SDK.

---

## Integration Flow

```
Customer → Checkout Page
  → "Pay via Cashfree" button
  → POST /api/payments/create-order
       Backend creates Cashfree order (Rupees, decimal)
       Returns short-lived paymentSessionId and orderId (NO client secrets)
  → Frontend loads Cashfree.js v3 and opens Drop-in checkout modal
       cashfree.checkout({ paymentSessionId, redirectTarget: '_modal' })
  → Customer completes payment (UPI, Cards, NetBanking)
  → Result received (result.paymentDetails)
  → POST /api/payments/verify
       Backend re-fetches authoritative order status: cashfree.PGFetchOrder(order_id)
       Fulfills order ONLY if order_status === 'PAID'
       Decrements stock & updates Supabase order status to 'Paid'
  → Customer redirected to /order-confirmation/:orderId
```

---

## Backend Routes

### `POST /api/payments/create-order`
- Creates a Cashfree order via `cashfree.PGCreateOrder({ order_id, order_amount, order_currency, customer_details, order_meta, order_note })`.
- Amount is in **Rupees** (decimal), never paise.
- Returns `{ success: true, orderId, orderNumber, cfOrderId, paymentSessionId, amount, currency }`.
- In case credentials are not configured, returns 503 with code `CASHFREE_NOT_CONFIGURED`.

### `POST /api/payments/verify`
- Authoritative server-side status verification via `cashfree.PGFetchOrder(order_id)`.
- Never trusts a client-side callback alone.
- When `order_status === 'PAID'`: updates order to `'Paid'`, decrements product inventory, sets `is_sold_out: true` if stock hits 0.

### `POST /api/payments/webhook`
- Receives raw JSON payload with `x-webhook-signature` and `x-webhook-timestamp`.
- **Replay Protection**: Verifies `x-webhook-timestamp` age against server time; automatically rejects webhooks older than 300 seconds (5 minutes) with HTTP 400.
- Verifies HMAC-SHA256 Base64 signature with `cashfree.PGVerifyWebhookSignature`.
- Idempotently processes events: `PAYMENT_SUCCESS_WEBHOOK`, `PAYMENT_FAILED_WEBHOOK`, `REFUND_STATUS_WEBHOOK`.

### `POST /api/payments/refund`
- Initiates refund via `cashfree.PGOrderCreateRefund(order_id, { refund_id, refund_amount, refund_note })`.
- Updates order status to `Refunded`.

---

## Environment Variables Needed

### Backend (`backend/.env` & Render)
```env
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret_key
CASHFREE_ENV=SANDBOX # or PRODUCTION
```

### Frontend (`frontend/.env` & Vercel)
```env
VITE_CASHFREE_MODE=sandbox # or production
```

---

## Security & Best Practices

1. **No Public Keys on Frontend:** Unlike Razorpay which sends `key_id`, Cashfree uses short-lived, order-scoped `payment_session_id`. No API secrets or merchant credentials touch the client.
2. **Authoritative Backend Verification:** Order fulfillment occurs exclusively after server-to-server check (`cashfree.PGFetchOrder`) or verified webhook event.
3. **Webhook Signature Security:** Cashfree HMAC-SHA256 signs `timestamp + rawBody` with `CASHFREE_SECRET_KEY` and encodes as Base64.
4. **Idempotent Stock Decrement:** Stock decrement occurs once per payment transition to avoid duplicate inventory deductions.
