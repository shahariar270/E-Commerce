# MERN E-commerce Platform

A full-stack e-commerce application built to demonstrate practical MERN development, end-to-end feature ownership, and consistent learning through a real product workflow. Positioned as a **bangladeshi ecommerce solution** and one of the **best ecommerce CMS** options for launching a **bangladeshi ecommerce business**, it ships with global SEO and per-product, title-wise SEO out of the box.

This project is not only a UI demo. It is a working application structure with an admin experience, customer shopping flow, REST API, MongoDB models, JWT authentication, Redux Toolkit state management, shared response handling, and SEO-friendly metadata with JSON-LD structured data.

## Why I Built This

The main purpose of this project is to preview my skill, dedication, and growth as a developer. A complete e-commerce system has many real-world problems: protected routes, nested data, form validation, image upload, product-category relationships, order lifecycle, user profile updates, and different user roles. Building these features helped me practice both frontend thinking and backend architecture instead of only making static pages.

## Tech Stack

**Frontend**
- React 19 with Vite
- React Router for public, user, and admin routes
- Redux Toolkit for async data flow and centralized state
- Formik and Yup for forms and validation
- react-helmet-async for SEO metadata and JSON-LD structured data
- SCSS component styling
- Vitest for frontend test support

**Backend**
- Node.js and Express
- MongoDB with Mongoose models
- JWT authentication and role authorization
- bcrypt password hashing
- multer for file handling
- Cloudinary image upload
- Zod validation for authentication APIs
- dotenv-based environment configuration

## Main Features

**Customer side**
- Product listing with search and pagination
- Product detail page with gallery, description, reviews, and product Q/A
- Add to cart, update quantity, remove item, and calculate totals
- Checkout flow with shipping information
- Customer order history
- User registration, login, profile update, password update, and profile image upload

**Admin side**
- Dashboard cards for revenue, orders, products, and customers
- Product CRUD with category assignment
- Product image upload flow
- Category create, update, delete, listing, and status handling
- Order management with status updates
- Protected admin-only API access

**SEO**
- Global SEO with the target keywords: `best ecommerce cms`, `bangladeshi ecommerce solution`, `bangladeshi ecommerce business`
- Per-product, title-wise SEO on every product detail page (dynamic title, description, keywords, canonical URL)
- Open Graph and Twitter Card meta tags for rich social sharing
- JSON-LD structured data: `Product` schema (offers, aggregate rating, reviews) and `BreadcrumbList`
- Reusable `<SEO>` component and centralized helpers in `admin/src/Utils/seo.js`
- Keyword-rich, descriptive `alt` text on product images

**System behavior**
- JWT token authentication stored client-side
- Role-based backend middleware for admin actions
- Central `ApiResponse` helper for consistent API responses
- Redux async thunks for API communication
- Automatic notification middleware for success/error feedback
- Global local/production environment files at the project root

## Project Structure

```text
E-commerce/
  admin/                 React + Vite frontend
    src/
      components/        Reusable UI components (includes SEO)
      pages/             Admin and auth pages
      UserPage/          Customer shopping pages
      store/             Redux store, slices, middleware
      Utils/             API client, helpers, validation schemas, seo.js

  server/                Express + MongoDB backend
    controls/            Request handlers / business logic
    router/              API route definitions
    model/               Mongoose schemas
    middlewares/         Auth and file upload middleware
    validation_schema/   Backend validation
    utils/               API response and Cloudinary helpers
```

## API Areas

- `auth`: register, login, profile, profile update
- `category`: category CRUD
- `product`: product CRUD, product list, single product, image upload
- `cart`: add item, read cart, update quantity, remove item
- `order`: create order, user orders, admin orders, status update
- `dashboard`: admin dashboard metrics
- `comment`: product Q/A with replies
- `review`: product ratings and customer reviews

## Environment Setup

The project uses global environment files in the repository root:

```text
.env.local
.env.production
```

Required values:

```env
PORT=5000
DB_URL=mongodb://127.0.0.1:27017/e_commerce
JWT_TOKEN=your_jwt_secret

FRONTEND_URL=http://localhost:5173
VITE_API_BASE=http://localhost:5000

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Run Locally

Install backend dependencies:

```bash
cd server
npm install
npm run dev
```

Install frontend dependencies:

```bash
cd admin
npm install
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## What This Project Shows

This project shows that I can work across the stack, connect frontend features to backend APIs, design database relationships, protect sensitive routes, handle async UI state, and keep improving an application through iteration. It also shows my willingness to work through the less glamorous parts of development: validation, loading states, error handling, reusable components, environment setup, and data consistency.

I built it as a learning project, but with the mindset of a real product: clear modules, practical features, and a foundation that can keep growing.
