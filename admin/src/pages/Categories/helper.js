import { categorySchema } from '@utils/validationSchemas';

export const getCategoryInitialValues = (category) => {
    return {
        name: category ? category.name : '',
        slug: category ? category.slug : '',
        is_active: category ? category.is_active : true,
    };
};

export const getCategoryValidationSchema = () => {
    return categorySchema;
};