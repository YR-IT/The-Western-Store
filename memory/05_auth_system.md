# 05 — Auth System

## Overview

There are **two completely separate auth systems** in this project:

| Auth Type | Who | Technology | Storage |
|-----------|-----|-----------|---------|
| **Customer Auth** | Shoppers | Supabase Auth (Google OAuth + email) | Supabase session |
| **Admin Auth** | Store owner/staff | Custom JWT via Express backend | `sessionStorage` |

---

## 🧑‍💼 Admin Auth Flow

### Login Steps
1. Admin visits `/admin/login` → `AdminLoginPage.tsx`
2. Submits email + password form
3. `loginAsAdmin(email, password)` in `StoreContext` is called
4. POST to `http://localhost:4000/api/admin/login`
5. Backend validates against `ADMIN_EMAIL` + `ADMIN_PASSWORD` env vars using `crypto.timingSafeEqual`
6. On success: backend returns `{ success: true, token: "JWT...", user: { id, name, email, role: 'admin' } }`
7. Frontend stores token in `sessionStorage` as `tws_admin_token`
8. **⭐ CRITICAL:** `loginAsAdmin` maps `role: 'admin'` → `isAdmin: true` when calling `setCurrentUser()`
9. Navigates to `/admin`

### Admin Route Guard (`AdminRoute.tsx`)
```typescript
// Checks: adminToken from React state OR sessionStorage fallback
const token = adminToken || sessionStorage.getItem('tws_admin_token');
if (!token) return <Navigate to="/admin/login" />;
```

### AdminPanel Inner Guard
```typescript
// Checks currentUser.isAdmin boolean
if (!currentUser?.isAdmin) {
  return <div>Admin Access Required</div>;
}
```

> ⚠️ **Two separate checks must both pass:**
> 1. `AdminRoute` — checks JWT token exists
> 2. `AdminPanel` — checks `currentUser.isAdmin === true`

### Admin Logout
- `logout()` in StoreContext clears `adminToken` state + removes `tws_admin_token` from `sessionStorage`

### JWT Token Properties
- **Algorithm:** HS256
- **Payload:** `{ role: 'admin', email: 'admin@thewesternstore.com' }`
- **Expiry:** 12 hours
- **Secret:** `JWT_SECRET` env var

### Backend `requireAdmin` Middleware
All `/api/admin/*` routes (except `/api/admin/login`) are protected by `requireAdmin`:
- Reads `Authorization: Bearer <token>` header
- Verifies with `jwt.verify(token, JWT_SECRET)`
- Returns 401 if invalid/expired

---

## 👤 Customer Auth Flow

### Login Methods
1. **Google OAuth** via Supabase
2. **Email/Password** via Supabase Auth
3. **Signup** creates new Supabase user

### Auth State
- Managed by Supabase client in `frontend/src/lib/supabase.ts`
- `StoreContext` listens to `supabase.auth.onAuthStateChange`
- On sign-in: creates/retrieves user profile, sets `currentUser` with `isAdmin: false`

### Customer Route Guard (`PrivateRoute.tsx`)
- Checks `currentUser` (non-admin) is logged in
- If not, redirects to `/login`

### `AuthModal.tsx`
- Overlay modal for customer login/signup
- Also has a **secret admin login tab** (accessed via a special trigger)
- Uses `loginAsAdmin()` internally

---

## 🔑 Admin Credentials

| Field | Value |
|-------|-------|
| Email | `admin@thewesternstore.com` |
| Password | `admin123` |
| Login URL | `http://localhost:5173/admin/login` |

> ⚠️ Change `ADMIN_PASSWORD` in `.env` before going to production.

---

## 🛑 Rate Limiting on Login

| Limiter | Window | Max Attempts |
|---------|--------|-------------|
| `loginLimiter` | 15 minutes | **20 attempts** |
| `contactLimiter` | 15 minutes | 5 messages |
| `trackLimiter` | 1 minute | 15 requests |
| `orderCreateLimiter` | 15 minutes | 15 orders |

> **Note:** Was originally 5 attempts — increased to 20 after repeated dev lockouts (429 errors).  
> Rate limit counters are **in-memory only** — restart backend to clear them.
