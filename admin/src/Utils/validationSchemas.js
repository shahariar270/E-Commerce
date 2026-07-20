import * as Yup from "yup";

// AUTH VALIDATIONS
export const loginSchema = Yup.object({
    email: Yup.string()
        .email("invalid email")
        .required("email is required field"),
    password: Yup.string()
        .min(6, "password must be at least 6 characters")
        .required("password is required field"),
});

export const registerSchema = Yup.object({
    user_name: Yup.string()
        .min(2, "user name must be at least 2 characters")
        .required("user name is required field"),
    email: Yup.string()
        .email("invalid email")
        .required("email is required field"),
    password: Yup.string()
        .min(6, "password must be at least 6 characters")
        .required("password is required field"),
    first_name: Yup.string()
        .min(2, "first name must be at least 2 characters")
        .required("first name is required field"),
    last_name: Yup.string()
        .min(2, "last name must be at least 2 characters")
        .required("last name is required field"),
});

export const updateProfileSchema = Yup.object({
    current_pass: Yup.string()
        .min(6, "current password must be at least 6 characters")
        .optional(),
    new_pass: Yup.string()
        .min(6, "new password must be at least 6 characters")
        .optional(),
    first_name: Yup.string()
        .min(2, "first name must be at least 2 characters")
        .max(100, "first name must not exceed 100 characters")
        .optional(),
    last_name: Yup.string()
        .min(2, "last name must be at least 2 characters")
        .max(100, "last name must not exceed 100 characters")
        .optional(),
});

// CATEGORY VALIDATIONS
export const categorySchema = Yup.object({
    name: Yup.string()
        .min(2, "name must be at least 2 characters")
        .required("name is required field"),
    slug: Yup.string()
        .min(2, "slug must be at least 2 characters")
        .required("slug is required field"),
    is_active: Yup.boolean().optional(),
});

// PRODUCT VALIDATIONS
export const productSchema = Yup.object({
    product_name: Yup.string()
        .min(3, "product name must be at least 3 characters")
        .required("product name is required field"),
    description: Yup.string()
        .min(10, "description must be at least 10 characters")
        .optional(),
    price: Yup.number()
        .positive("price must be a positive number")
        .required("price is required field"),
    stock: Yup.string()
        .oneOf(["in_stock", "out_of_stock", "low_stock"], "invalid stock status")
        .optional(),
    category_ids: Yup.array()
        .of(Yup.string())
        .min(1, "at least one category is required")
        .required("category is required field"),
});

// CART VALIDATIONS
export const cartSchema = Yup.object({
    product_id: Yup.string()
        .required("product id is required field"),
    name: Yup.string()
        .required("product name is required field"),
    price: Yup.number()
        .positive("price must be a positive number")
        .required("price is required field"),
    quantity: Yup.number()
        .min(1, "quantity must be at least 1")
        .required("quantity is required field"),
});

// COUPON VALIDATIONS
export const couponSchema = Yup.object({
    code: Yup.string()
        .min(3, "code must be at least 3 characters")
        .max(30, "code must not exceed 30 characters")
        .required("code is required field"),
    discount_type: Yup.string()
        .oneOf(["percentage", "fixed"], "invalid discount type")
        .required("discount type is required field"),
    discount_value: Yup.number()
        .positive("discount value must be a positive number")
        .when("discount_type", {
            is: "percentage",
            then: (schema) => schema.max(100, "percentage discount cannot exceed 100"),
        })
        .required("discount value is required field"),
    max_discount_amount: Yup.number()
        .positive("max discount amount must be a positive number")
        .nullable()
        .optional(),
    min_purchase_amount: Yup.number()
        .min(0, "minimum purchase amount cannot be negative")
        .optional(),
    usage_limit: Yup.number()
        .positive("usage limit must be a positive number")
        .nullable()
        .optional(),
    expiry_date: Yup.date()
        .required("expiry date is required field"),
    is_active: Yup.boolean().optional(),
});

// ORDER VALIDATIONS
export const orderSchema = Yup.object({
    shippingAddress: Yup.object({
        street: Yup.string()
            .required("street is required field"),
        city: Yup.string()
            .required("city is required field"),
        state: Yup.string()
            .required("state is required field"),
        zip: Yup.string()
            .required("zip code is required field"),
        country: Yup.string()
            .required("country is required field"),
        phone: Yup.string().optional(),
    }),
});
