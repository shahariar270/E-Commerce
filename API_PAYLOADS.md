# E-Commerce API Complete Payload Documentation

## 🔐 AUTH ENDPOINTS

### 1. Register User
**POST** `/auth/register`
```json
{
  "user_name": "string (required, min 2 chars)",
  "email": "string (required, valid email)",
  "password": "string (required, min 6 chars)",
  "first_name": "string (required, min 2 chars)",
  "last_name": "string (required, min 2 chars)",
  "user_role": "string (optional, default: 'user')"
}
```
**Errors:**
- user name is required field
- user name must be at least 2 characters
- email is required field
- invalid email
- password is required field
- password must be at least 6 characters
- first name is required field
- first name must be at least 2 characters
- last name is required field
- last name must be at least 2 characters

---

### 2. Login User
**POST** `/auth/login`
```json
{
  "email": "string (required, valid email)",
  "password": "string (required, min 6 chars)"
}
```
**Errors:**
- Your Request Email User Found (404)
- Password Wrong (401)

---

### 3. Update Profile
**PUT** `/auth/profile`
```json
{
  "current_pass": "string (optional, min 6 chars if provided)",
  "new_pass": "string (optional, min 6 chars if provided)",
  "first_name": "string (optional, min 2 chars, max 100)",
  "last_name": "string (optional, min 2 chars, max 100)"
}
```

---

## 📦 PRODUCT ENDPOINTS

### 1. Create Product
**POST** `/api/products` (Requires Authentication)
```json
{
  "name": "string (required)",
  "description": "string (optional)",
  "price": "number (required)",
  "stock": "number (optional, default: 0)",
  "image": "string (optional, URL)",
  "category_ids": ["string (required, array of category IDs)"],
  "sku": "string (optional)",
  "weight": "number (optional)",
  "dimensions": "object (optional)"
}
```

---

### 2. Update Product
**PUT** `/api/products/:id` (Requires Authentication)
```json
{
  "name": "string (optional)",
  "description": "string (optional)",
  "price": "number (optional)",
  "stock": "number (optional)",
  "image": "string (optional)",
  "category_ids": ["string (optional)"],
  "sku": "string (optional)"
}
```

---

### 3. Get All Products
**GET** `/api/products`
```
Query Parameters:
- category: string (optional, filter by category)
- stock: number (optional, filter by stock)
- search: string (optional, search in product name)
- page: number (optional, default: 1)
- per_page: number (optional, default: 10)
```

---

### 4. Get Single Product
**GET** `/api/products/:id`
```
No payload required
```

---

### 5. Delete Product
**DELETE** `/api/products/:id` (Requires Authentication)
```
No payload required
```

---

## 🏷️ CATEGORY ENDPOINTS

### 1. Create Category
**POST** `/api/categories` (Requires Authentication)
```json
{
  "name": "string (required)",
  "slug": "string (required, unique)",
  "is_active": "boolean (optional, default: true)"
}
```
**Errors:**
- Name and slug are required
- Category already exists

---

### 2. Update Category
**PUT** `/api/categories/:id` (Requires Authentication)
```json
{
  "name": "string (optional)",
  "slug": "string (optional, unique)",
  "is_active": "boolean (optional)"
}
```

---

### 3. Get All Categories
**GET** `/api/categories`
```
Query Parameters:
- page: number (optional, default: 1)
- limit: number (optional, default: 10)
```

---

### 4. Delete Category
**DELETE** `/api/categories/:id` (Requires Authentication)
```
No payload required
```

---

## 🛒 CART ENDPOINTS

### 1. Add to Cart / Create Cart
**POST** `/api/cart` (Requires Authentication)
```json
{
  "product_id": "string (required, ObjectId)",
  "name": "string (required, product name)",
  "price": "number (required)",
  "quantity": "number (required, minimum 1)"
}
```

---

### 2. Get Cart
**GET** `/api/cart` (Requires Authentication)
```
No payload required
```
**Response includes:**
- items array with product details
- total_quantity
- total_price

---

### 3. Update Cart Item Quantity
**PUT** `/api/cart` (Requires Authentication)
```json
{
  "product_id": "string (required, ObjectId)",
  "quantity": "number (required, minimum 1)"
}
```

---

### 4. Remove Item from Cart
**DELETE** `/api/cart/:id` (Requires Authentication)
```
No payload required
Path Parameter:
- id: product_id to remove
```

---

## 📋 ORDER ENDPOINTS

### 1. Create Order
**POST** `/api/orders` (Requires Authentication)
```json
{
  "shippingAddress": {
    "street": "string (required)",
    "city": "string (required)",
    "state": "string (required)",
    "zip": "string (required)",
    "country": "string (required)",
    "phone": "string (optional)"
  }
}
```
**Note:** Cart must have items. Items are automatically pulled from user's cart.
**On Success:** Cart is cleared after order creation

---

### 2. Get All Orders (Admin)
**GET** `/api/orders/admin/all` (Requires Authentication + Admin Role)
```
No payload required
Sorted by createdAt descending
```

---

### 3. Get Single Order
**GET** `/api/orders/:id` (Requires Authentication)
```
Path Parameter:
- id: order ID
```

---

### 4. Update Order Status
**PUT** `/api/orders/:id` (Requires Authentication + Admin Role)
```json
{
  "status": "string (required)",
  "paymentStatus": "string (optional)"
}
```
**Allowed Statuses:**
- Pending
- Processing
- Shipped
- Delivered
- Cancelled

---

## ⚠️ COMMON ERROR RESPONSES

All endpoints return error responses in this format:
```json
{
  "success": false,
  "message": "error message description"
}
```

Or with validation error:
```json
{
  "success": false,
  "message": "specific field error message"
}
```

---

## 🔑 AUTHENTICATION HEADERS

For authenticated endpoints, include:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

---

## 📊 RESPONSE FORMAT

**Success Response (201/200):**
```json
{
  "success": true,
  "message": "operation description",
  "data": { /* entity data */ }
}
```

**List Response:**
```json
{
  "success": true,
  "message": "description",
  "data": [ /* array of items */ ],
  "total": 100,
  "count": 10
}
```

---

## 🎯 VALIDATION RULES SUMMARY

| Field | Type | Rules |
|-------|------|-------|
| user_name | String | Min 2 chars, required |
| email | String | Valid email format, required |
| password | String | Min 6 chars, required |
| first_name | String | Min 2 chars, max 100 |
| last_name | String | Min 2 chars, max 100 |
| price | Number | Required for products |
| quantity | Number | Min 1 |
| slug | String | Unique, required for categories |
| category_ids | Array | Required for products |

