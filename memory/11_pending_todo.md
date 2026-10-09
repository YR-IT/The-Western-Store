# 11 — Pending To-Do & Open Items

## 🔴 Critical / Blocking

- [ ] **Razorpay KYC** — Complete KYC verification to enable live payments
  - Submit website URL first (can be done now)
  - Provide legal business name, GSTIN, bank details, PAN
- [ ] **Legal Business Name** — Needed in `STORE_INFO.legalName` in `mockData.ts`
- [ ] **GSTIN** — Needed in `STORE_INFO.gstin` (or confirm unregistered)
- [ ] **Grievance Officer** — Required under Consumer Protection Rules 2020:
  - Name → `STORE_INFO.grievanceOfficer`
  - Email → `STORE_INFO.grievanceEmail`

---

## 🟡 Important / Soon

- [ ] **Add actual products** to Supabase via Admin Panel
- [ ] **Upload hero banner images** for desktop (16:9) and mobile (9:16) via Admin Panel
- [ ] **Set category images** for all categories
- [ ] **Configure home sections** — enable/disable and order in Admin Panel
- [ ] **Update `FRONTEND_URL`** in `backend/.env` to actual production domain before deploy
- [ ] **Change `ADMIN_PASSWORD`** from `admin123` before going live
- [ ] **Change `JWT_SECRET`** to a long random string before production

---

## 🟢 Nice to Have / Future

- [ ] **Razorpay Live Integration** — switch from WhatsApp checkout to online payment
- [ ] **Order Email Notifications** — send confirmation emails via Nodemailer or Resend
- [ ] **WhatsApp Business API** — automated order notifications via official API
- [ ] **Google Merchant Center** — product feed for Google Shopping
- [ ] **Instagram Shopping** — tag products in Instagram posts
- [ ] **Analytics** — add Google Analytics 4 or Plausible
- [ ] **Push Notifications** — PWA push for order updates
- [ ] **Sitemap.xml** — for SEO indexing
- [ ] **Supabase Realtime** — replace 25-second polling with live order updates in Admin Panel
- [ ] **Product Reviews** — allow customers to submit reviews post-delivery
- [ ] **Size Guide** — upload size chart image per category
- [ ] **Coupon/Discount Codes** — promo code system at checkout
- [ ] **Multi-location Inventory** — if store expands to second location

---

## 📝 Content Pending from Store Owner

| Item | Where Used |
|------|-----------|
| Legal business name | `STORE_INFO.legalName`, Policy pages, Razorpay KYC |
| GSTIN | `STORE_INFO.gstin`, Policy pages, Razorpay KYC |
| Grievance Officer name | `STORE_INFO.grievanceOfficer`, Privacy Policy |
| Grievance Officer email | `STORE_INFO.grievanceEmail`, Privacy Policy |
| Bank account details | Razorpay KYC |
| PAN card | Razorpay KYC |
| Product catalog with images | Admin Panel → Products |
| Hero banner images (desktop + mobile) | Admin Panel → Hero Banners |
| Category images | Admin Panel → Categories |

---

## 🐛 Potential Future Issues to Watch

- **Supabase RLS** — Double-check that guest orders (null `user_id`) can be created but not publicly read
- **ImageKit Storage Limits** — Monitor usage as product images grow
- **Admin JWT Expiry** — Token expires in 12 hours; admin will need to re-login daily
- **Rate Limiter Reset** — If backend restarts, all rate limit counters reset (in-memory)
- **tsx watch `.env` blindspot** — Always `touch src/index.ts` after editing `.env`

---

## 🗓️ Timeline Reference

| Date | Milestone |
|------|-----------|
| Oct 9, 2026 | Routing refactored from single-page view state to React Router |
| Oct 9, 2026 | Admin JWT auth fully working |
| Oct 9, 2026 | Mobile hero carousel aspect ratio fixed |
| Oct 9, 2026 | Memory folder created |
| TBD | Products added to catalog |
| TBD | Razorpay KYC completed |
| TBD | Production deployment |
