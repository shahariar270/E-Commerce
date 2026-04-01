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
                // validationSchema={getCategoryValidationSchema()}
                onSubmit={handleSubmit}
                enableReinitialize   
            >
                {({ values, isSubmitting }) => (
                    <Form>
                        {/* Name Field */}
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <Field
                                as={Input}
                                id="name"
                                name="name"
                                placeholder="Enter category name"
                                label="Name"
                                required
                            />
                            <ErrorMessage
                                name="name"
                                component="span"
                                className="error-text"
                            />
                        </div>

                        {/* Slug Field */}
                        <div className="form-group">
                            <label htmlFor="slug">Slug</label>
                            <Field
                                as={Input}
                                id="slug"
                                name="slug"
                                placeholder="Enter category slug"
                                label="Slug"
                                required
                            />
                            <ErrorMessage
                                name="slug"
                                component="span"
                                className="error-text"
                            />
                        </div>

                        {/* Active Checkbox */}
                        <div className="form-group">
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
                        </div>

                        {/* Action Buttons */}
                        <div className="modal-actions">
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? 'Saving...'
                                    : id ? 'Update' : 'Create'}
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleCloseModal}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

export default CategoryFormInner;