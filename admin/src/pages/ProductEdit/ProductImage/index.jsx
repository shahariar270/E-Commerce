import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateProduct, uploadProductImages } from "@Store/slices/productSlice";
import ImageUpload from "@Component/ImageUpload";

const ProductImages = ({ productId, data }) => {
    const [images, setImages] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        if (data?.image_gallery?.length) {
            setImages(
                data.image_gallery.map((url) => ({
                    file: null,
                    preview: url,
                    isExisting: true,
                }))
            );
        } else {
            setImages([{ file: null, preview: null }]);
        }
    }, [data?.image_gallery]);

    const handleSelect = (index, file) => {
        const updated = [...images];
        updated[index] = {
            file,
            preview: URL.createObjectURL(file),
        };
        setImages(updated);
    };

    const handleRemove = async (index) => {
        const removedImage = images[index];

        const updated = images.filter((_, i) => i !== index);
        setImages(updated.length > 0 ? updated : [{ file: null, preview: null }]);

        if (removedImage?.isExisting) {
            try {
                const updatedGallery = images
                    .filter((_, i) => i !== index)
                    .filter((img) => img.isExisting)
                    .map((img) => img.preview);

                await dispatch(
                    updateProduct({
                        id: productId,
                        data: { image_gallery: updatedGallery },
                    })
                );
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleAdd = () => {
        setImages([...images, { file: null, preview: null }]);
    };

    const handleUpload = async () => {
        try {
            const files = images.map((img) => img.file).filter(Boolean);
            if (files.length === 0) return;

            const res = await dispatch(
                uploadProductImages({ id: productId, images: files })
            ).unwrap();

            const existingUrls = images
                .filter((img) => img.isExisting)
                .map((img) => img.preview);

            await dispatch(
                updateProduct({
                    id: productId,
                    data: { image_gallery: [...existingUrls, ...res] },
                })
            );
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            {images.map((img, index) => (
                <ImageUpload
                    key={index}
                    label={`Image ${index + 1}`}
                    previewSrc={img.preview}
                    onFileSelect={(file) => handleSelect(index, file)}
                    onRemove={() => handleRemove(index)}
                />
            ))}
            <button onClick={handleAdd}>➕ Add Image</button>
            <br /><br />
            <button onClick={handleUpload}>Upload All</button>
        </div>
    );
};

export default ProductImages;