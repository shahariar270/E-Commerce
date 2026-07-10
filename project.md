# Project Notes — MERN E-Commerce Platform

A full-stack e-commerce platform (customer storefront + admin panel) built on
MongoDB, Express, React, and Node. Positioned as a Bangladeshi e-commerce CMS,
with SEO baked in at both the site-wide and per-product level.

## Folder Structure

```
E-commerce/
├── README.md                 # Project overview / pitch
├── NOTIFICATION_SYSTEM.md    # Toast notification architecture
├── details.md                # Branding / marketing notes
├── admin/                    # React (Vite) frontend — serves both admin panel and storefront
│   └── src/
│       ├── pages/            # Admin pages (Dashboard, Products, Orders, Categories, ...)
│       ├── UserPage/          # Customer-facing pages (Cart, Checkout, Order, ProductSinge)
│       ├── components/       # Shared UI + business components (SEO, Table, Modal, ...)
│       ├── store/             # Redux Toolkit slices + middleware
│       ├── Utils/             # api.js, helper.js, seo.js, validationSchemas.js
│       └── App.jsx            # Routing (public, user, admin — admin gated by ProtectedAdmin)
└── server/                   # Express backend
    ├── app.js                 # App setup: security middleware, CORS, Mongo connection, Socket.IO
    ├── router/                # Route definitions
    ├── controls/               # Request handlers / business logic
    ├── model/                 # Mongoose schemas
    ├── middlewares/            # auth_middleware, file_handle (multer)
    ├── validation_schema/      # Zod schemas
    └── utils/                  # ApiResponse, Cloudinary helpers
```

## Tech Stack

**Frontend (`admin/`)**
- React 19 + Vite, React Router 7
- Redux Toolkit + React Redux (state), Redux Logger (dev)
- Formik + Yup (forms/validation)
- react-helmet-async (SEO/meta tags)
- SCSS modules, react-select, jwt-decode, socket.io-client (installed, currently unused)
- Vitest + ESLint

**Backend (`server/`)**
- Node.js + Express 5, Socket.IO
- MongoDB + Mongoose
- JWT auth (jsonwebtoken) + bcrypt
- Security: helmet, express-rate-limit (20 req/15min on `/api/auth`), express-mongo-sanitize, CORS allowlist
- multer + Cloudinary (image uploads)
- Zod (backend validation), nodemailer (configured, not actively wired up)

## Key Features

**Customer-facing**
- Product browsing/search with per-product SEO (title, description, JSON-LD, OG/Twitter tags)
- Product detail page with image gallery, star-rating reviews, and threaded Q&A comments
- Cart, multi-step checkout, order history/status tracking
- Auth (register/login), profile with Cloudinary avatar upload

**Admin panel** (route-guarded via `ProtectedAdmin`, checks JWT `user_role === 'admin'`)
- Dashboard with revenue/orders/products/customers metrics and trend charts
- Product CRUD with category assignment, stock status, up to 5 gallery images
- Category CRUD (slug auto-generation, active/inactive toggle)
- Order management (view, update status, delete)

**Cross-cutting**
- Global + per-page SEO helpers (`admin/src/Utils/seo.js`, `admin/src/components/SEO`)
- Automatic toast notifications driven by API response shape via Redux middleware
  (see `NOTIFICATION_SYSTEM.md`)
- Socket.IO wired into `server/app.js` but connection handling is commented out on both ends

## Data Models (`server/model/`)

| Model | Notable fields |
|---|---|
| User | user_name, email, password (bcrypt), user_role (buyer/seller/admin), image |
| Product | product_name, description, image_gallery[], category[], stock, price |
| Category | name, slug (unique), is_active |
| Cart | user_id (unique), items[], total_quantity, total_price |
| Order | user, items[], totalAmount, shippingAddress, status, paymentStatus |
| Review | author, product, rating (1-5), title, comment |
| Comment | product, author, content, parent (for threaded replies) |

## API Surface (`server/router/`)

- `/auth`: register, login, profile (get/update)
- `/api/product(s)`: CRUD (create/update/delete admin-only), image upload
- `/api/categor(y/ies)`: CRUD
- `/api/cart`: get/add/update/remove
- `/api/order(s)`, `/api/admin/order`: create, list, admin status update/delete
- `/api/review`, `/api/comment(s)`: CRUD, nested replies
- `/api/dashboard/*`: admin metrics

## Environment Variables

Backend reads `.env.local` (dev) or `.env.production` (prod) via `server/config/env.js`:
`PORT`, `DB_URL`, `JWT_TOKEN`, `FRONTEND_URL`, `VITE_API_BASE`,
`CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET`, `SMTP_HOST/PORT/USER/PASS`, `EMAIL_ADDRESS`.

## Scripts

- `server/package.json`: `start` (node app.js), `dev` (nodemon app.js)
- `admin/package.json`: `dev` (vite), `build`, `preview`, `lint`, `test` (vitest)

## Security Notes (from recent audit, see git log)

- JWT secret has no hardcoded fallback — server refuses to start without `JWT_TOKEN`
- Registration cannot set `user_role` from the request body (no self-promotion to admin)
- helmet, mongo-sanitize, rate limiting on `/api/auth`, JSON body limit (currently 100kb —
  bumped from the audit's 10kb to allow larger payloads, see commit `4ec6836`)
- multer restricted to image extensions, 5MB max
- `ApiResponse.error` no longer leaks internal error details in production
- Socket.IO CORS restricted to `FRONTEND_URL` (no longer `*`)

## Prepared but Inactive

- Socket.IO real-time updates (both client and server have the wiring, connection logic commented out)
- Nodemailer SMTP sending (configured via Mailtrap, not called anywhere yet)
