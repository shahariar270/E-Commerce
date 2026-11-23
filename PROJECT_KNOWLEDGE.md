# Project Knowledge Base & Brain Memory — E-Commerce MERN

> **Purpose**: This document serves as the persistent system memory for this project. It captures the architecture, data schemas, routing, running state, test credentials, resolved issues, and pending enhancements. It ensures that in all subsequent commands, the assistant acts with immediate, full context without needing to repeatedly re-read lines of code from scratch.

---

## 1. System Topology & Active Runtime

- **Backend**: Express 5 on Node 24 (`server/app.js`)
  - **Port**: `5000` (Listening: `0.0.0.0:5000`)
  - **Start Command**: `node app.js` (in `server/`)
  - **Tests**: `npm test` (Jest — 6 test suites, 65 tests)
  - **Environment**: `.env.local`
- **Frontend**: React 19 + Vite 8 (`admin/`)
  - **Port**: `5173` (Listening: `127.0.0.1:5173`)
  - **Dev Command**: `npm run dev` (in `admin/`)
  - **Build Command**: `npm run build` (Rolldown / Vite)
  - **Tests**: `npx vitest run` (Vitest — 4 test suites, 36 tests)
- **Database**: MongoDB local (`mongodb://127.0.0.1:27017/e_commerce`)
  - **Seed Script**: `node seed/import.js`

---

## 2. Seed Accounts & Test Credentials

All seeded accounts share the same password:
- **Default Password**: `Password123!`
- **Admin Account**: `user1@example.com` | Role: `admin` | Has access to `/admin/*`
- **Buyer Account**: `user2@example.com` | Role: `buyer` | Standard storefront shopper
- **Additional Test Accounts**: `user3@example.com` to `user9@example.com` (buyers)

---

## 3. Database Models & Schema Critical Rules

| Model | File | Critical Rules & Insights |
|---|---|---|
| **User** | `server/model/auth/index.js` | `google_id` has `sparse: true, unique: true`. **NEVER set `default: null`** — in MongoDB sparse indexes, explicit `null` is indexed, breaking uniqueness for non-Google users. `User.syncIndexes()` is called on startup. |
| **Product** | `server/model/product/index.js` | `stock` is numeric (derived in/low/out-of-stock). Has `brand`, `sku`, `warranty`, and `image_gallery[]`. |
| **Cart** | `server/model/cart/index.js` | Supports both logged-in (`user_id`) and guest (`guest_id`) carts via sparse indexes. `Cart.syncIndexes()` reconciles indexes on startup. |
| **Order** | `server/model/order/index.js` | Atomically decrements stock upon placement; restocks inventory on order cancellation/deletion via `stock_restored` idempotent flag. |
| **Coupon** | `server/model/coupon/index.js` | Percentage or fixed discounts, usage limit, min purchase, expiry, auto-apply. Re-validated server-side at checkout. |
| **Settings** | `server/model/settings/index.js` | Controls storewide preferences like `require_guest_email_verification`. |
| **EmailVerification** | `server/model/emailVerification/index.js` | One-time 6-digit code for guest checkout email verification. |
| **PasswordReset** | `server/model/passwordReset/index.js` | Single-use 30-min token (SHA-256 hash stored), 1-minute resend cooldown. |

---

## 4. API & Routing Architecture

### Backend Mounting (`server/router/index.js` & `server/app.js`):
- `/auth`: Mounted on `router.use('/auth', auth_router)`
  - `POST /auth/register`
  - `POST /auth/login`
  - `POST /auth/google`
  - `POST /auth/forgot-password`
  - `POST /auth/reset-password`
  - `GET /auth/profile`, `PUT /auth/profile`
  - Rate limiting is mounted on `['/auth', '/api/auth']` (20 req / 15 min).
- `/api`: All store resources:
  - `/api/products`, `/api/categories`, `/api/cart`, `/api/orders`
  - `/api/admin/orders`, `/api/dashboard/cards`, `/api/dashboard/total_data`
  - `/api/coupons`, `/api/customers`, `/api/subscribers`, `/api/settings`
  - `/api/email/send-code`, `/api/email/verify-code`

### Frontend Client (`admin/src/Utils/api.js`):
- Automatically prefixes endpoints with `${VITE_API_BASE}/api`.
- Attaches `Authorization: Bearer <token>` when logged in, or `X-Guest-Id: <uuid>` when unauthenticated.

### Frontend Routing (`admin/src/App.jsx`):
- **Storefront**: Wrapped in `<StorefrontLayout />`
  - `/` (Home), `/products` (Catalog), `/product/:id` (Details), `/cart`, `/checkout`
  - `/privacy-policy`, `/terms-of-use`, `/faq`
- **Auth**: `/login`, `/register`, `/forgot-password`, `/reset-password`
- **Admin**: Guarded by `<ProtectedAdmin>` (checks JWT `user_role === 'admin'`)
  - `/admin/dashboard`, `/admin/products`, `/admin/categories`, `/admin/orders`
  - `/admin/customers`, `/admin/subscribers`, `/admin/coupons`, `/admin/settings`

---

## 5. Real-Time & WebSockets (`server/socket/index.js`)

- Handshake authenticates JWT token; users with `user_role === 'admin'` join the `'admins'` room.
- `register_controller` emits `new_user` to `'admins'` upon user registration.
- `create_order` emits `new_order` to `'admins'` upon order placement.
- Client `AdminNotificationSocket` connects only for admins, triggering toast notifications, updating the bell badge, and playing a synthesized Web Audio chime.

---

## 6. Fixes Applied in This Session

1. **Native Bindings Resolved**:
   - Installed `@rolldown/binding-linux-x64-gnu` (admin) and `@unrs/resolver-binding-linux-x64-gnu` (server) to resolve Node 24 optional dependency resolution bugs.
2. **MongoDB `google_id_1` Duplicate Key Crash**:
   - Removed `default: null` from `google_id` in `server/model/auth/index.js`.
   - Cleaned existing null records and ran `seed/import.js` cleanly.
3. **Auth Rate Limiter Route Prefix**:
   - Updated `server/app.js` to mount rate limiting on `['/auth', '/api/auth']` so `/auth/login` and `/auth/register` are actively protected.
4. **User Index Reconciliation**:
   - Added `await User.syncIndexes()` alongside `Cart.syncIndexes()` on server startup in `server/app.js`.
5. **Redundant Body Parser**:
   - Removed duplicate `10kb` json parser in `server/app.js`.
6. **Storefront Navigation & Accessibility**:
   - Converted unstyled `<a onClick>` in `Nav.jsx` and `Footer.jsx` to semantic React Router `<Link>` elements.
   - Fixed dead links in Footer ("My Account" -> `/profile`, "Login / Register" -> `/login`, "Cart" -> `/cart`, "Contact" -> `/faq`).

---

## 7. Known Backlog & QA Observations

- **Product Single Review Scope**: In `ProductSinge/index.jsx`, review fetching is guarded by `if (reviews.length === 0)`, causing subsequent products to reuse stale reviews. Needs product-scoped fetch.
- **Admin Category Search**: In `Categories/index.jsx`, search only filters the local 10-item page rather than querying the backend.
- **Guest Verification Toggle Visibility**: `GET /api/settings` requires admin role, while `Checkout/index.jsx` hardcodes `requiresEmailVerification = !isAuthenticated`.
