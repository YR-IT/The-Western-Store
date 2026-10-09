# 09 — Payments & Razorpay

## Current Status: 🟡 Sandbox Mode (Not Live)

Razorpay integration code is complete, but **live keys have not been configured** because KYC verification is pending.

---

## Integration Flow

```
Customer → Checkout Page
  → "Pay with Razorpay" button
  → POST /api/razorpay/create-order  (backend creates Razorpay order)
  → Frontend opens Razorpay payment modal
  → Customer pays
  → Razorpay returns payment ID + signature
  → POST /api/razorpay/verify-payment  (backend verifies HMAC signature)
  → On success → order created in Supabase → redirect to /order-confirmation
```

---

## Backend Routes

### `POST /api/razorpay/create-order`
- Creates a Razorpay order with the given amount (in paise)
- Returns `{ orderId, amount, currency, keyId }`
- **Without keys:** Returns sandbox notification response

### `POST /api/razorpay/verify-payment`
- Verifies `razorpay_order_id + razorpay_payment_id` signature against `RAZORPAY_KEY_SECRET`
- Uses `crypto.timingSafeEqual` for secure HMAC comparison
- On success: saves the order to Supabase

---

## Environment Variables Needed

```env
RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
```

---

## 📋 KYC Requirements (Razorpay Verification)

To go live, the store owner needs to complete Razorpay KYC:

| Requirement | Status |
|------------|--------|
| Business website URL | ✅ Can submit now (website is being built) |
| Legal business name | ⚠️ Not yet confirmed — must match PAN/bank records |
| GSTIN (15-digit) | ⚠️ Not yet provided (may be unregistered) |
| Bank account details | ⚠️ Not yet provided |
| PAN card | ⚠️ Not yet provided |

### Key Insight: Website First
> You **can** submit the website for KYC verification before filling all other details.  
> Razorpay allows partial submission — fill what you have, complete the rest later.  
> The website will be reviewed regardless, so submit it early.

---

## Checkout Flow (Alternative — WhatsApp)

If Razorpay is not yet live, the **WhatsApp Checkout flow** is the primary order method:

1. Customer fills cart
2. Clicks "Order via WhatsApp"
3. `WhatsAppCheckoutModal` opens → collects name, phone, address
4. On submit: order saved to Supabase with status `'Pending WhatsApp'`
5. WhatsApp opens pre-filled with order summary
6. Store manually confirms + processes payment

This is the **current active checkout path** for the store.

---

## Frontend Razorpay Integration

- Razorpay JS SDK is loaded dynamically in `CheckoutPage.tsx`
- Payment modal is opened using `window.Razorpay({ ... options })`
- `key_id` comes from backend response (never hardcoded on frontend)

---

## Security Notes

- Payment signatures are verified **server-side only** — frontend cannot fake a successful payment
- `RAZORPAY_KEY_SECRET` is **never sent to frontend**
- HMAC verification uses `crypto.timingSafeEqual` to prevent timing attacks
