const Category = require("../../model/category");
const Product = require("../../model/product");
const { uploadImage } = require('../../utils/cloudniry');
const ApiResponse = require('../../utils/api_response');


class product_controller {
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

            return ApiResponse.success(res, "Product Created successfully", new_product, 201);

        } catch (error) {
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async update_product(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const get_product = await Product.findById(id);

            if (!get_product || !id) {
                return ApiResponse.error(res, "Product not founded", 404);
            };

            const updated_data = await Product.findByIdAndUpdate(id, data, { new: true })

            return ApiResponse.success(res, "Product updated Successfully", updated_data);

        } catch (error) {
            return ApiResponse.error(res, error.message, 500);
        }
    };

    async get_single_product(req, res) {
        try {
            const { id } = req.params;
            const single_product = await Product.findById(id);

            if (!id) {
                return ApiResponse.error(res, "Product not founded", 404);
            };

            return ApiResponse.success(res, "Product data Successfully", single_product);

        } catch (error) {
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async get_products(req, res) {
        try {
            const { category, stock, search, filter, page = 1, per_page = 10 } = req.query;
            let query = {};
            let sort = { createdAt: -1 };
            let priceSort = null;

            if (search) {
                query.product_name = { $regex: search, $options: "i" };
            }

            if (category) {
                query['category._id'] = category;
            }

            if (filter) {
                switch (filter) {
                    case 'hig_to_lo':
                        priceSort = -1;
                        break;
                    case 'lo_to_hig':
                        priceSort = 1;
                        break;
                    case 'a_to_z':
                        sort = { product_name: 1 };
                        break;
                    case 'z_to_a':
                        sort = { product_name: -1 };
                        break;
                    default:
                        sort = { createdAt: -1 };
                }
            }

            const limit = parseInt(per_page);
            const skip = (parseInt(page) - 1) * limit;

            let get_all_products;

            if (priceSort !== null) {
                // price is stored as String, so use $toInt to sort numerically
                get_all_products = await Product.aggregate([
                    { $match: query },
                    { $addFields: { priceNum: { $toInt: '$price' } } },
                    { $sort: { priceNum: priceSort } },
                    { $skip: skip },
                    { $limit: limit },
                    { $project: { priceNum: 0 } },
                ]);
            } else {
                get_all_products = await Product.find(query)
                    .limit(limit)
                    .skip(skip)
                    .sort(sort);
            }

            const total = await Product.countDocuments(query);

            return ApiResponse.success(res, "Product fetched", {
                products: get_all_products,
                total,
            });
        } catch (error) {
            return ApiResponse.error(res, error.message, 500);
        }

    };

    async delete_product(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return ApiResponse.error(res, "Product not founded", 404);
            }
            await Product.findByIdAndDelete(id);

            return ApiResponse.success(res, "Product Deleted Successfully");


        } catch (error) {
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async upload_image(req, res) {
        try {
            const files = req.files;
            const product_id = req.query.product_id;
            if (!files || files.length === 0) {
                return ApiResponse.error(res, "No files uploaded", 400);
            }
            const image_urls = [];

            for (let file of files) {
                const url = await uploadImage(file.path);
                image_urls.push(url);
            }
            return ApiResponse.success(res, "Image Upload successfully", image_urls, 201);
        } catch (error) {
            return ApiResponse.error(res, error.message, 500);
        }
    }

}

module.exports = new product_controller(); 