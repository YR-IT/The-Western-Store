# 11 — Pending To-Do & Open Items

## 🔴 Critical / Blocking

- [ ] **Razorpay KYC** — Complete KYC for live payments (website URL, legal name, GSTIN, bank, PAN)
- [ ] **Legal Business Name** — `STORE_INFO.legalName` in `mockData.ts`
- [ ] **GSTIN** — `STORE_INFO.gstin` (or confirm unregistered)
- [ ] **Grievance Officer** — Consumer Protection Rules 2020 (`grievanceOfficer` / `grievanceEmail`)
- [ ] **Prod catalog content** — Ensure products/heroes exist in live Supabase (empty catalog = data/sync, not upload bug)

---

## 🟡 Important / Soon

- [ ] **Add / sync products** via Admin Panel on production
- [ ] **Hero banners** desktop 16:9 + mobile 9:16
- [ ] **Category images** for all categories
- [ ] **Homepage sections** enable/order in Admin → Homepage
- [ ] **Change `ADMIN_PASSWORD`** from `admin123` before hard launch
- [ ] **Rotate `JWT_SECRET`** to a long random string (then redeploy Render)
- [x] **Production frontend + backend live** — Vercel + Render (`thewesternstore.in` / `the-western-store.onrender.com`)
- [x] **ImageKit account `89dmpbgrm`** + server upload path
- [x] **Admin panel simplified** (no URL paste, no restore-categories, no navbar share)

---

## 🟢 Nice to Have / Future

- [x] **Razorpay Exclusive Checkout** — WhatsApp checkout removed
- [x] **Admin RLS Proxy** — service_role catalog mutations
- [x] **Guest Cart Merge**
- [x] **Live Inventory Decrement**
- [x] **PLP Search & Filter Wiring**
- [ ] **Order Email Notifications** — Nodemailer / Resend
- [ ] **WhatsApp Business API** — order notifications
- [ ] **Google Merchant Center**
- [ ] **Instagram Shopping**
- [ ] **Analytics** — GA4 or Plausible
- [ ] **Push Notifications** — PWA
- [ ] **Supabase Realtime** — replace 25s admin order polling
- [ ] **Product Reviews**
- [ ] **Size Guide**
- [ ] **Coupon/Discount Codes**
- [ ] **Multi-location Inventory**

---

## 📝 Content Pending from Store Owner

| Item | Where Used |
|------|-----------|
| Legal business name | `STORE_INFO.legalName`, policies, Razorpay KYC |
| GSTIN | `STORE_INFO.gstin`, policies, Razorpay KYC |
| Grievance Officer name/email | Privacy Policy |
| Bank + PAN | Razorpay KYC |
| Product catalog with images | Admin → Products (ImageKit upload) |
| Hero banner images | Admin → Homepage / Hero |
| Category images | Admin → Categories |

---

## 🐛 Watch List

- **Supabase RLS** — guest orders (`user_id` null) create OK, not publicly readable
- **ImageKit limits** — account `89dmpbgrm`
- **Admin JWT** — 12h expiry
- **Render cold starts** — free tier ~15 min idle spin-down
- **tsx watch / Render env** — restart after `.env` changes
- **Safari uploads** — keep ImageKit input without restrictive `accept` / `.click()`

---

## 🗓️ Timeline Reference

| Date | Milestone |
|------|-----------|
| Oct 9, 2026 | React Router + admin JWT + hero aspect fix; memory folder created |
| Oct 13, 2026 | Razorpay-only checkout; admin catalog proxy; cart/stock/PLP fixes |
| Oct 2026 | Prod Vercel + Render; ImageKit `89dmpbgrm` server upload; Safari upload fix; admin UX simplify |
| TBD | Full catalog on prod; Razorpay KYC; harden secrets |
