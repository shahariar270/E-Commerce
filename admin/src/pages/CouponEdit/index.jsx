import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Formik, Field } from "formik";
import { createCoupon, updateCoupon, getCouponById } from "@Store/slices/couponSlice";
import {
    getCouponInitialValues,
    getCouponValidationSchema,
    discountTypeOptions,
    generateCouponCode,
} from "@Pages/Coupons/helper";
import Button from "@Component/Buttons";
import Input from "@Component/Input";
import Select from "@Component/Select";
import ErrorMessage from "@Component/ErrorMessage";
import SubHeading from "@Component/SubHeading";
import SEO from "@Component/SEO";
import "@Pages/Coupons/styles.scss";

const CouponEdit = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();

    const currentCoupon = useSelector((state) => state.coupon.currentCoupon);

    useEffect(() => {
        if (id && currentCoupon?._id !== id) {
            dispatch(getCouponById(id));
        }
    }, [id, currentCoupon]);

    const couponToEdit = id ? currentCoupon : null;

    const handleSubmit = (values, { setSubmitting }) => {
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
                .then(() => navigate("/admin/coupons"))
                .catch((err) => console.error('Update failed:', err))
                .finally(() => setSubmitting(false));
        } else {
            dispatch(createCoupon(couponData))
                .unwrap()
                .then(() => navigate("/admin/coupons"))
                .catch((err) => console.error('Create failed:', err))
                .finally(() => setSubmitting(false));
        }
    };

    const handleCancel = () => {
        navigate("/admin/coupons");
    };

    return (
        <div className="st-form-inner st-gap-4">
            <SEO title={id ? "Edit Coupon" : "Add Coupon"} noindex />
            <Formik
                enableReinitialize
                initialValues={getCouponInitialValues(couponToEdit)}
                validationSchema={getCouponValidationSchema()}
                onSubmit={handleSubmit}
            >
                {({ values, isSubmitting, setFieldValue, errors, touched, dirty }) => (
                    <Form className="st-form-inner--container">
                        <SubHeading
                            leftContent={
                                <div className="st-align-center st-gap-2">
                                    <Button
                                        label="🔙"
                                        variant="secondary"
                                        onClick={handleCancel}
                                        type="button"
                                    />
                                    <h2 className="st-subHeading__title">{id ? "Edit Coupon" : "Create New Coupon"}</h2>
                                </div>
                            }
                            rightContent={
                                <div className="form-actions">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={(id && !dirty) || isSubmitting}
                                        label={isSubmitting
                                            ? 'Saving...'
                                            : id ? 'Update Coupon' : 'Create Coupon'}
                                    />
                                </div>
                            }
                        />

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
                            size="sm"
                            style={{ alignSelf: 'flex-start' }}
                            label="Generate Coupon Code"
                            onClick={() => setFieldValue('code', generateCouponCode())}
                        />

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

                        <div className="st-form--group">
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
                        </div>

                        <div className="st-form--group">
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
                        </div>

                        <label>
                            <Field
                                type="checkbox"
                                name="is_active"
                                checked={values.is_active}
                            />
                            Active
                        </label>
                        <ErrorMessage name="is_active" />

                        <div className="st-form-section st-form-section--auto-apply">
                            <label>
                                <Field
                                    type="checkbox"
                                    name="auto_apply"
                                    checked={values.auto_apply}
                                />
                                Auto Apply
                            </label>
                            <p className="st-form-section__hint">
                                Automatically apply this coupon to eligible carts at checkout, without the customer entering a code.
                            </p>
                        </div>
                        <ErrorMessage name="auto_apply" />
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default CouponEdit;
