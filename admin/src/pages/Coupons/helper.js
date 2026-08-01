import { couponSchema } from '@utils/validationSchemas';

const toDateInputValue = (date) => {
    if (!date) return '';
    return new Date(date).toISOString().slice(0, 10);
};

export const getCouponInitialValues = (coupon) => {
    return {
        code: coupon ? coupon.code : '',
        discount_type: coupon ? coupon.discount_type : 'percentage',
        discount_value: coupon ? coupon.discount_value : '',
        max_discount_amount: coupon?.max_discount_amount ?? '',
        min_purchase_amount: coupon?.min_purchase_amount ?? 0,
        usage_limit: coupon?.usage_limit ?? '',
        expiry_date: coupon ? toDateInputValue(coupon.expiry_date) : '',
        is_active: coupon ? coupon.is_active : true,
        auto_apply: coupon?.auto_apply ?? false,
    };
};

export const getCouponValidationSchema = () => {
    return couponSchema;
};

export const discountTypeOptions = [
    { label: 'Percentage', value: 'percentage' },
    { label: 'Fixed Amount', value: 'fixed' },
];

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export const generateCouponCode = (length = 8) => {
    let code = '';
    for (let i = 0; i < length; i++) {
        code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
    }
    return code;
};
