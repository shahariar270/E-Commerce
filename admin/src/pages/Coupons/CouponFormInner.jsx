import { Formik, Form, Field } from 'formik';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCouponInitialValues, getCouponValidationSchema, discountTypeOptions, generateCouponCode } from './helper';
import { createCoupon, updateCoupon, getCouponById } from '@Store/slices/couponSlice';
import { Modal } from '@Component/Modal';
import Input from '@Component/Input';
import Select from '@Component/Select';
import Button from '@Component/Buttons';
import ErrorMessage from '@Component/ErrorMessage';

export const CouponFormInner = ({ id, handleCloseModal }) => {
    const dispatch = useDispatch();
    const { currentCoupon, coupons } = useSelector((state) => state.coupon);

    useEffect(() => {
        if (id) {
            const existingCoupon = coupons.find(c => c._id === id);
            if (existingCoupon) return;
            dispatch(getCouponById(id));
        }
    }, [id, coupons]);

    const handleSubmit = (values, { setSubmitting, resetForm }) => {
        const couponData = {
            ...values,
            discount_value: Number(values.discount_value),
            max_discount_amount: values.max_discount_amount === '' ? null : Number(values.max_discount_amount),
            min_purchase_amount: values.min_purchase_amount === '' ? 0 : Number(values.min_purchase_amount),
            usage_limit: values.usage_limit === '' ? null : Number(values.usage_limit),
        };

        if (id) {
            dispatch(updateCoupon({ id, couponData }))
                .unwrap()
                .then(() => {
                    resetForm();
                    handleCloseModal();
                })
                .catch((err) => console.error('Update failed:', err))
                .finally(() => setSubmitting(false));
        } else {
            dispatch(createCoupon(couponData))
                .unwrap()
                .then(() => {
                    resetForm();
                    handleCloseModal();
                })
                .catch((err) => console.error('Create failed:', err))
                .finally(() => setSubmitting(false));
        }
    };

    return (
        <Modal
            isOpen={true}
            onClose={handleCloseModal}
            title={id ? 'Edit Coupon' : 'Add New Coupon'}
        >
            <Formik
                initialValues={getCouponInitialValues(id ? currentCoupon : null)}
                validationSchema={getCouponValidationSchema()}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ values, isSubmitting, setFieldValue, errors, touched }) => (
                    <Form className='st-form'>
                        <label className="st-label">Coupon Code</label>
                        <div className="st-input-wrapper">
                            <Field
                                name="code"
                                placeholder="e.g. SUMMER20"
                                className={`st-input ${errors.code && touched.code ? 'st-input--error' : ''}`}
                                onChange={(e) => setFieldValue('code', e.target.value.toUpperCase())}
                            />
                        </div>
                        <ErrorMessage name="code" />
                        <Button
                            type="button"
                            variant="secondary"
                            size="small"
                            label="Generate Coupon Code"
                            onClick={() => setFieldValue('code', generateCouponCode())}
                        >
                        </Button>

                        <Select
                            name="discount_type"
                            label="Discount Type"
                            options={discountTypeOptions}
                            value={discountTypeOptions.find(o => o.value === values.discount_type)}
                            onChange={(selected) => setFieldValue('discount_type', selected.value)}
                        />

                        <Input
                            name="discount_value"
                            label={values.discount_type === 'percentage' ? 'Discount (%)' : 'Discount Amount ($)'}
                            type="number"
                            placeholder="e.g. 20"
                        />

                        <Input
                            name="max_discount_amount"
                            label="Max Discount Amount ($) — optional cap"
                            type="number"
                            placeholder="e.g. 50"
                        />

                        <Input
                            name="min_purchase_amount"
                            label="Minimum Purchase Amount ($)"
                            type="number"
                            placeholder="0"
                        />

                        <Input
                            name="usage_limit"
                            label="Usage Limit — optional"
                            type="number"
                            placeholder="Unlimited"
                        />

                        <Input
                            name="expiry_date"
                            label="Expiry Date"
                            type="date"
                        />

                        <label>
                            <Field
                                type="checkbox"
                                name="is_active"
                                checked={values.is_active}
                            />
                            Active
                        </label>
                        <ErrorMessage name="is_active" />

                        <div className="st-flex st-modal-footer-button">
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isSubmitting}
                                label={isSubmitting
                                    ? 'Saving...'
                                    : id ? 'Update' : 'Create'}
                            >
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleCloseModal}
                                disabled={isSubmitting}
                                label='Cancel'
                            >
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

export default CouponFormInner;
