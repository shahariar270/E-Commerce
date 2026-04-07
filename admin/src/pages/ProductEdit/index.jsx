import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createProduct, getProductById, updateProduct } from "@Store/slices/productSlice";
import './styles.scss';
import Button from "@Component/Buttons";
import Input from "@Component/Input";
import { Form, Formik } from "formik";
import Select from "@Component/Select";
import { getCategories } from "@Store/slices/categorySlice";
import { useSelectPagination } from "@utils/Hooks/SelectPagination";

const ProductEdit = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const action = searchParams.get('action') || 'new';
    const id = searchParams.get('id');
    const currentProduct = useSelector(state => state.product.current);

    useEffect(() => {
        if (action === 'edit' && id) {
            dispatch(getProductById(id));
        }
    }, [id, action]);


    const handleSubmit = async (values) => {
        try {
            if (action === 'edit' && id) {
                await dispatch(updateProduct({ id, data: values })).unwrap();
            } else {
                await dispatch(createProduct(values)).unwrap();
            }
            navigate("/products");
        } catch (error) {
            console.error("Failed to save product:", error);
        }
    };

    const handleCancel = () => {
        navigate("/products");
    };

    const initialValues = {
        product_name: currentProduct?.product_name || '',
        description: currentProduct?.description || '',
        stock: currentProduct?.stock || 'in_stock',
        category_ids: currentProduct?.category?.map(i => i._id) || [],
        price: currentProduct?.price || ''
    }


    const selectedCategory = []
    const { options, handleLoadMore } = useSelectPagination(getCategories, selectedCategory);

    return (
        <div className="product-edit">
            <div className="product-edit__header">
                <h2>{action === 'edit' ? "Edit Product" : "Create New Product"}</h2>
            </div>
            <Formik
                enableReinitialize
                className="st-form-inner"
                onSubmit={handleSubmit}
                initialValues={initialValues}
            >
                {({ setFieldValue, values, isSubmitting, dirty }) => (
                    <Form className='st-form-inner--container'>
                        <Input
                            id="product_name"
                            name="product_name"
                            placeholder="Enter product name"
                            label="Product Name"
                        />

                        <Input
                            name={'description'}
                            as="textarea"
                            label="Description"
                            placeholder={'Enter a product description'}
                        />
                        <Input
                            label="Price"
                            name="price"
                            type="number"
                            placeholder="Enter price"
                        />
                        <Select
                            name="category_ids"
                            label="Select Product category"
                            options={options}
                            value={options.filter(i => values.category_ids.includes(i.value))}
                            onChange={(selected) =>
                                setFieldValue("category_ids", selected.map(i => i.value))
                            }
                            onMenuScrollToBottom={handleLoadMore}
                            isMulti
                        />


                        <div className="form-actions">
                            <Button
                                label="Cancel"
                                variant="secondary"
                                onClick={handleCancel}
                                type="button"
                            />
                            <Button
                                label={"Save Product"}
                                variant="primary"
                                type="submit"
                            />
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default ProductEdit;
