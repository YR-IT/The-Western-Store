# 01 — Project Overview

## 🏪 Business Context

**The Western Store** is a physical ethnic & western fashion boutique based in Kurukshetra, Haryana. This project is their **full-stack e-commerce platform** built to take the store online — enabling product browsing, WhatsApp-based ordering, Razorpay payments, and an admin management console.

---

## 🏬 Store Information

| Field | Value |
|-------|-------|
| **Store Name** | The Western Store |
| **Legal Name** | ⚠️ Not yet provided (needed for GST/Razorpay KYC) |
| **GSTIN** | ⚠️ Not yet provided |
| **Tagline** | Kurukshetra's Premier Ethnic & Western Wardrobe |
| **Address** | Opp. Hotel Pearl Marc, Railway Road, near Ujjivan Bank |
| **City / State** | Kurukshetra, Haryana — 136118 |
| **Phone** | +91 97295 15288 |
| **WhatsApp** | 919729515288 |
| **Email** | thewesternstorekkr@gmail.com |
| **Instagram** | @the_western_store_kkr |
| **Instagram (Glamify)** | @the_western_store_glamify |
| **Operating Hours** | 10:30 AM – 9:00 PM (Mon–Sun) |
| **Grievance Officer** | ⚠️ Not yet provided |
| **Grievance Email** | ⚠️ Not yet provided |

---

## 💰 Pricing & Shipping

| Setting | Value |
|---------|-------|
| Currency | INR (₹) |
| Flat Shipping Rate | ₹0 (currently free) |
| Free Shipping Threshold | ₹0 (always free) |

### Budget Tiers
| Tier ID | Label | Range |
|---------|-------|-------|
| `under_999` | Under ₹999 | Daily & Casual Wear |
| `under_1499` | ₹999 – ₹1,499 | Workwear & Co-Ords |
| `under_1999` | ₹1,499 – ₹1,999 | Festive & Party Wear |
| `premium` | Above ₹2,000 | Luxury & Heritage |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + TypeScript, Vite, React Router v6 |
| **Styling** | Vanilla CSS + Tailwind CSS utility classes |
| **Animations** | Motion/React (Framer Motion) |
| **Icons** | Lucide React |
| **Backend** | Node.js + Express + TypeScript (`tsx watch`) |
| **Auth (Customer)** | Supabase Auth (Google OAuth + email/password) |
| **Auth (Admin)** | Custom JWT (RS256 via `jsonwebtoken`) |
| **Database** | Supabase (PostgreSQL) |
| **Image CDN** | ImageKit.io |
| **Payments** | Razorpay (integration in progress / sandbox mode) |
| **Rate Limiting** | `express-rate-limit` |
| **Security** | `helmet` middleware, CORS allowlist |

---

## 🚀 Dev Server Commands

```bash
# Frontend (port 5173)
cd frontend && npm run dev

# Backend (port 4000)
cd backend && npm run dev
```

Frontend accesses backend at: `http://localhost:4000` (configurable via `VITE_BACKEND_URL`)
