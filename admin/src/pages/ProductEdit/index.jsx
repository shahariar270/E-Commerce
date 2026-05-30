import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createProduct, getProductById, updateProduct, uploadProductImages } from "@Store/slices/productSlice";
import './styles.scss';
import Button from "@Component/Buttons";
import Input from "@Component/Input";
import { Form, Formik } from "formik";
import Select from "@Component/Select";
import { getCategories } from "@Store/slices/categorySlice";
import { useSelectPagination } from "@utils/Hooks/SelectPagination";
import { productSchema } from "@utils/validationSchemas";
import ProductImages from "./ProductImage";
import SubHeading from "@Component/SubHeading";

const ProductEdit = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();

    const currentProduct = useSelector(state => state.product.current);

    useEffect(() => {
        if (id) {
            dispatch(getProductById(id));
        }
    }, []);


    const handleSubmit = async (values) => {
        try {
            if (id) {
                await dispatch(updateProduct({ id, data: values })).unwrap();
            } else {
                await dispatch(createProduct(values)).unwrap();
            }
            // navigate("/admin/products");
        } catch (error) {
            console.error("Failed to save product:", error);
        }
    };

    const handleCancel = () => {
        navigate("/admin/products");
    };

    const initialValues = (data) => {
        if (data) {
            return {
                ...data,
                category_ids: currentProduct?.category?.map(i => i._id) || []
            }
        }

        return {
            product_name: currentProduct?.product_name || '',
            description: currentProduct?.description || '',
            stock: currentProduct?.stock || 'in_stock',
            category_ids: currentProduct?.category?.map(i => i._id) || [],
            price: currentProduct?.price || ''
        }
    }


    const selectedCategory = []
    const { options, handleLoadMore } = useSelectPagination(getCategories, selectedCategory);

    return (
        <div className="st-form-inner st-gap-4">
            <Formik
                enableReinitialize
                onSubmit={handleSubmit}
                initialValues={initialValues(currentProduct)}
                validationSchema={productSchema}
            >
                {({ setFieldValue, values, isSubmitting, dirty }) => (
                    <Form className='st-form-inner--container'>
                        <SubHeading
                            // title={id ? "Edit Product" : "Create New Product"}
                            leftContent={
                                <div className="st-align-center st-gap-2">
                                    <span className="st-icon st-icon--clipboard" />
                                    <h2 className="st-subHeading__title">{id ? "Edit Product" : "Create New Product"}</h2>
                                </div>
                            }
                            rightContent={
                                <div className="form-actions">
                                    <Button
                                        label="Cancel"
                                        variant="secondary"
                                        onClick={handleCancel}
                                        type="button"
                                    />
                                    <Button
                                        label={id ? "Updated product" : "Create Product"}
                                        variant="primary"
                                        type="submit"
                                        disabled={!dirty || isSubmitting}
                                    />
                                </div>
                            }
                        />
                        <Input
                            id="product_name"
                            name="product_name"
                            placeholder="Enter product name"
                            label="Product Name"
                            required
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
                            required
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
                        {values?._id && (
                            <ProductImages productId={values?._id} data={values} />
                        )}
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default ProductEdit;
