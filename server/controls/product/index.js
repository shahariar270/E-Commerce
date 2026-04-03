const Product = require("../../model/product");


class product_controller {
    constructor() {

    }

    async create_product(req, res) {
        try {
            const { ...data } = req.body;
            const user_id = req.user.id;
            const schema_merge = { user_id, ...data }

            const new_product = await Product.create(schema_merge);

            return res.status(201).json({
                success: true,
                message: "Product Created successfully",
                data: new_product
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            })

        }
    }

    async update_product(req, res) {
        try {
            const { id } = req.query;
            const data = req.body;
            const updated_data = Product.findOneAndUpdate(id, data, { new: true });

            if (!updated_data || !id) {
                return res.status(404).json({
                    success: false,
                    message: "Product not founded",
                })
            }

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
            const { id } = req.query;
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

}

module.exports = new product_controller(); 