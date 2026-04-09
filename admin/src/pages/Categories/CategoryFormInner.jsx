import { Formik, Form, Field, ErrorMessage } from 'formik';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCategoryInitialValues, getCategoryValidationSchema } from './helper';
import { createCategory, updateCategory, getCategoryById } from '@Store/slices/categorySlice';
import { Modal } from '@Component/Modal';
import Input from '@Component/Input';
import Button from '@Component/Buttons';

export const CategoryFormInner = ({ id, openModalHandler, handleCloseModal }) => {
    const dispatch = useDispatch();
    const { currentCategory } = useSelector((state) => state.category);

    useEffect(() => {
        if (id) {
            dispatch(getCategoryById(id));
        }
    }, [id]);

    const handleSubmit = (values, { setSubmitting, resetForm }) => {
        if (id) {
            dispatch(updateCategory({ id, categoryData: values }))
                .unwrap()
                .then(() => {
                    resetForm();
                    handleCloseModal();
                })
                .catch((err) => console.error('Update failed:', err))
                .finally(() => setSubmitting(false));
        } else {
            dispatch(createCategory(values))
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
            title={id ? 'Edit Category' : 'Add New Category'}
        >
            <Formik
                initialValues={getCategoryInitialValues(currentCategory)}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ values, isSubmitting, setFieldValue }) => (
                    <Form className='st-form'>
                        <label className="st-label" >Enter Category Title</label>
                        <div className="st-input-wrapper">
                            <Field
                                name="name"
                                placeholder="Title"
                                className='st-input'
                                onChange={(e) => {
                                    const val = e.target.value;

                                    setFieldValue("name", val);
                                    setFieldValue("slug", val.toLowerCase().replace(/\s+/g, "_"));
                                }}
                            />
                        </div>
                        <ErrorMessage
                            name="name"
                            component="span"
                            className="error-text"
                        />

                        <Input
                            id="slug"
                            name="slug"
                            placeholder="Enter category slug"
                            label="Slug"
                            disabled
                            required
                        />
                        <ErrorMessage
                            name="slug"
                            component="span"
                            className="error-text"
                        />

                        <label>
                            <Field
                                type="checkbox"
                                name="is_active"
                                checked={values.is_active}
                            />
                            Active
                        </label>
                        <ErrorMessage
                            name="is_active"
                            component="span"
                            className="error-text"
                        />
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

export default CategoryFormInner;