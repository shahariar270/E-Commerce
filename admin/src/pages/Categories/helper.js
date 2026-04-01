export const getCategoryInitialValues = (category) => {
    return {
        name: category ? category.name : '',
        slug: category ? category.slug : '',
        is_active: category ? category.is_active : true,
    };
};

export const getCategoryValidationSchema = () => {
    return Yup.object().shape({
        name: Yup.string().required('Name is required'),
        slug: Yup.string().required('Slug is required'),
    });
};