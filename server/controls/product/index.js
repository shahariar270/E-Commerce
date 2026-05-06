const Category = require("../../model/category");
const Product = require("../../model/product");
const { uploadImage } = require('../../utils/cloudniry');


class product_controller {
    constructor() {

    }

    async create_product(req, res) {
        try {
            const { category_ids, ...data } = req.body;
            const user_id = req.user.id;

            const categories = await Category.find({
                _id: { $in: category_ids }
            }).select("_id name slug");

            const schema_merge = {
                user_id,
                category: categories,
                ...data
            };

            let new_product = await Product.create(schema_merge);

            return res.status(201).json({
                success: true,
                message: "Product Created successfully",
                data: new_product
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async update_product(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const get_product = await Product.findById(id);

            if (!get_product || !id) {
                return res.status(404).json({
                    success: false,
                    message: "Product not founded",
                })
            };

            const updated_data = await Product.findByIdAndUpdate(id, data, { new: true })

            return res.status(200).json({
                success: true,
                message: "Product updated Successfully",
                data: updated_data,
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            })
        }
    };

    async get_single_product(req, res) {
        try {
            const { id } = req.params;
            const single_product = await Product.findById(id);

            if (!id) {
                return res.status(404).json({
                    success: false,
                    message: "Product not founded",
                })
            };

            return res.status(200).json({
                success: true,
                message: "Product data Successfully",
                data: single_product,
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async get_products(req, res) {
        try {
            const { category, stock, search, page, per_page } = req.query;
            let query = {};

            if (search) {
                query.name = { $regex: search, $options: "i" };
            }

            if (category) {
                query.category = category;
            }

            const skip = (parseInt(page) - 1) * per_page;
            const get_all_products = await Product.find().
                limit(parseInt(per_page))
                .skip(skip)
                .sort({ createdAt: -1 });
            const total = await Product.countDocuments();

            return res.status(200).json({
                success: true,
                message: "Product fetched",
                data: get_all_products,
                total,
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }

    };

    async delete_product(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(404).json({
                    success: true,
                    message: "Product not founded",
                });
            }
            await Product.findByIdAndDelete(id);

            return res.status(200).json({
                success: true,
                message: "Product Deleted Successfully",
            })


        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async upload_image(req, res) {
        try {
            const files = req.files;
            const product_id = req.query.product_id;
            if (!files || files.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "No files uploaded",
                });
            }
            const image_urls = [];

            for (let file of files) {
                const url = await uploadImage(file.path);
                image_urls.push(url);
            }
            return res.status(201).json({
                message: "Image Upload successfully",
                success: true,
                data: image_urls,
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

}

module.exports = new product_controller(); 