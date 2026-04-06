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

const ProductEdit = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const action = searchParams.get('action') || 'new';
    const id = searchParams.get('id');
    const currentProduct = useSelector(state => state.product.current);
    const category = useSelector(state => state.category.categories);

    useEffect(() => {
        if (action === 'edit' && id) {
            dispatch(getProductById(id));
        }
    }, [id, action]);

    useEffect(() => {
        dispatch(getCategories({ page: 1, limit: 100 }));
    }, []);


    const handleSubmit = (values) => {
        try {
            if (action === 'edit' && id) {
                dispatch(updateProduct({ id, data: values })).unwrap();
            } else {
                dispatch(createProduct(values)).unwrap();
            }
            navigate("/products");
        } catch (error) {
            console.error("Failed to save product:", error);
        }
    };

    const handleCancel = () => {
        navigate("/products");
    };

    const initialValues = () => {
        if (currentProduct) {
            return currentProduct;
        }
        return {
            product_name: '',
            description: '',
            stock: '',
            category_ids: '',
            price: ''
        }
    }

    return (
        <div className="product-edit">
            <div className="product-edit__header">
                <h2>{action === 'edit' ? "Edit Product" : "Create New Product"}</h2>
            </div>
            <Formik
                className="st-form-inner"
                onSubmit={handleSubmit}
                initialValues={initialValues}
            >
                <Form className='st-form-inner--container'>
                    <Input
                        id="product_name"
                        name="product_name"
                        placeholder="Enter product name"
                        required
                        label="Product Name"
                    />
                    <Input
                        name={'description'}
                        as="textArea"
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
                        label={'Assign Category'}
                        value={category}
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
            </Formik>
        </div>
    );
};

export default ProductEdit;
