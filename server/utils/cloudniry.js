const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImage = async (filePath) => {
    if (!filePath) return null;
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'e_commerce_products',
            use_filename: true,
            unique_filename: false,
            overwrite: true
        });
        return result.secure_url;
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        throw error;
    }
};

module.exports = {
    uploadImage
};