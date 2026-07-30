# Changes: `feature/coupon-system` vs `master`

Snapshot comparison of the `feature/coupon-system` branch ([PR #15](https://github.com/shahariar270/E-Commerce/pull/15), open & mergeable) against `master`.

- **65 commits**, **126 files changed** (+7,280 / −535)
- Generated: 2026-07-30

This branch has absorbed three other merged PRs on top of the original coupon-system work: [#19](https://github.com/shahariar270/E-Commerce/pull/19) (live admin notifications), [#20](https://github.com/shahariar270/E-Commerce/pull/20) (order-cancellation restock), and [#21](https://github.com/shahariar270/E-Commerce/pull/21) (forgot/reset password).

---

## New Features

### 🔔 Live admin notifications (Socket.IO)
- New `SocketManager` (`server/socket/index.js`) — authenticates each socket handshake with the connecting user's JWT (signature, active account, `user_role === 'admin'`) and joins verified sockets to an `admins` room.
- `register_controller` and `create_order` emit `new_user` / `new_order` to that room after the DB write succeeds.
- Admin panel: `AdminNotificationSocket` connects only for admins, driving a toast, a bell-dropdown entry (`adminNotificationSlice`, wired into the previously-unused `NotificationPopover`), and a synthesized "ding" (`notificationSound.js`, Web Audio API — no asset file).

### 🔑 Forgot / reset password
- `POST /auth/forgot-password` — issues a single-use, 30-minute reset token (only its SHA-256 hash is stored, in a new `PasswordReset` collection), with a resend cooldown, emails a reset link, and never reveals whether an email is registered.
- `POST /auth/reset-password` — validates the email + token pair, updates the password, and invalidates the token.
- New `ForgotPassword` / `ResetPassword` pages (with tests for the auth slice thunks); the login page's previously dead "Forgot password?" link now points at the new flow.

### 🔐 Google Sign-In
- `POST /auth/google` — verifies a Google ID token server-side (`google-auth-library`), creates or links a `User` (new `google_id` field), and issues the same JWT as normal login.
- `GoogleLogin` button + `googleLogin` thunk added to the Login page.

### 🎟️ Coupon system
- New `Coupon` model/controller/router — percentage or fixed discounts, usage limits, min purchase, expiry, auto-apply.
- Admin: dedicated Coupons list + create/edit pages (moved off a modal), code generator, copy-code button.
- Cart/checkout: coupons can be applied/removed by both logged-in users and guests, auto-applied when eligible, and re-validated server-side at checkout against the live coupon record.

### 🛒 Guest checkout
- Anonymous users can browse, cart, and purchase without an account, identified by an `X-Guest-Id` header (`auth_middleware.identify`).
- Guest email must be verified via a one-time code (new `EmailVerification` model/controller/router) before checkout — togglable per-store via a new admin Settings page (`Settings` model/controller, `require_guest_email_verification`).
- Cart schema updated to support a nullable/sparse `user_id` (guest carts), with a `Cart.syncIndexes()` call on server startup to reconcile the index on already-existing databases.

### 📦 Product stock / inventory
- `Product.stock` changed from a 3-state enum string (`in_stock` / `coming_soon` / `out_stock`) to a real numeric count; in/low/out-of-stock status is now derived from that number everywhere it's shown, instead of stored separately.
- Checkout atomically decrements stock per item (with rollback if a later item in the same order fails) instead of trusting client-supplied availability.
- Cancelling or deleting an order now restocks the reserved quantity — previously stock was only ever decremented at order creation and never restored, so cancelled/deleted orders permanently locked up inventory. A `stock_restored` flag on `Order` makes the restock idempotent across both paths.
- New `brand`, `sku`, `warranty` product fields plus a highlights box on the product detail page.

### 👤 Customers & newsletter
- Admin **Customers** page — list users, order count per customer, disable/enable accounts.
- Logged-in customers can save a default shipping address from Profile and reuse it at checkout.
- Newsletter: public opt-in (footer form + a 30-second popup), checkout opt-in, and a new admin **Subscribers** page.

### 🔍 SEO
- Dynamic per-page SEO (title/description/meta) applied across the whole storefront and admin site, not just a couple of pages.

### 📄 Static pages
- Privacy Policy, Terms of Use, and FAQ pages, wired into routing and the footer.

---

## Fixes

- **Settings page styling** — the page's inline `<style>` tag used SCSS-nesting syntax (`&__title`, `&::before`, ...), invalid in a plain CSS `<style>` element, so the toggle switch and label/description spacing silently never applied. Flattened to valid CSS.
- **Stock never restored** on order cancellation/deletion (see above).
- Order confirmation emails: fixed trusting a client-supplied email for logged-in orders, and escaped user-controlled fields to prevent HTML/XSS injection into the email body.
- Password show/hide "eye" icon rendered as an empty box (wrong icon-font classes) — replaced with inline SVG icons and moved inside the input's own border.
- `ProductEdit` and `CategoryFormInner` edit modals loading blank when the record was already in the list cache.
- Coupon edit form loading blank; missing copy-code button.
- Stock checks silently passing for products with no `stock` field stored (missing `$ifNull` guard).
- Newsletter popup never showing for already-logged-in users.
- Dead "Buy Now" button on the product page; a stale cart index that blocked guests.
- Cart state not clearing immediately after purchase (nav badge stayed stale).
- Mis-branded logo asset (`fulllogo.svg`) replaced with the correct one.
- Non-admin users no longer see the admin sidebar.

---

## UX / polish

- "Generate Coupon Code" button no longer stretches full width.
- Verification "Send Code" button moved inline next to the email field; general polish pass on the guest checkout / verification UI.
- Shipping address field changed to a textarea; Bangladeshi phone number format validated.
- Pointer cursor on all buttons site-wide.
- Products page switched from click-through pagination to infinite scroll.
- Homepage now shows a randomized product selection instead of a fixed set.
- Order details modal added to the admin Orders table (plus customer email column).
- Shared `Button` component restyled to be more prominent.

---

## Dev tooling

- `.claude/launch.json` — dev server launch configs for `server` and `admin`.
- `seed/` — `export.js` / `import.js` scripts plus a sanitized seed data snapshot (`seed/data/*.json`) for spinning up a local DB with realistic data.
- First tests in the admin app: `authSlice.test.js` covering the forgot/reset password thunks.

---

## New dependencies

- `google-auth-library`, `@react-oauth/google` — Google Sign-In.
- `socket.io` / `socket.io-client` — already present but previously unused; now actually wired up for live notifications.

## Data model changes

- `User`: `google_id` (Google Sign-In).
- `Cart`: `user_id` now nullable/sparse, plus a new sparse-unique `guest_id` and an embedded `coupon` sub-document, to support guest carts and coupons.
- `Order`: `user` now optional (paired with a new `guest_id`), plus `email`, `subtotal`, `coupon.{code, discount_amount}`, and `stock_restored`.
- `Product`: `stock` changed from enum string to `Number`; new `brand`, `sku`, `warranty` fields.
- New collections: `Coupon`, `EmailVerification`, `Settings`, `Subscriber`, `PasswordReset`.

---

## Known pre-existing issue (not fixed on this branch)

`User.google_id` defaults to `null` in the schema, which defeats its `sparse` unique index (sparse indexes only skip fields that are truly *absent*, not explicit `null`) — the second non-Google registration on a from-scratch database throws a duplicate-key error.
