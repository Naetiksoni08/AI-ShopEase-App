const ProductModel = require("../models/productSchema");
const api = require("../utils/api");

module.exports.CreateProduct = async (req, res) => {
    try {
        const { name, price, Image, description, category, brand, stock } = req.body;
        const product = await ProductModel.create({
            name, price, Image, description, category,
            brand, stock,
            seller: req.user.id   // comes from auth middleware — seller is whoever is logged in
        });
        api.success(res, product);
    } catch (error) {
        api.error(res, error, "Failed to create product");
    }
}

module.exports.getProductById = async (req, res) => {
    try {
        const productid = req.params.id;
        const Product = await ProductModel.findById(productid);
        api.success(res, Product, "Product fetched successfully!");
    } catch (error) {
        api.error(res, error, "Failed to fetch product");
    }
}

module.exports.GetAllProducts = async (req, res) => {
    try {
        const {
            search,
            category,
            minPrice,
            maxPrice,
            sort,
            page = 1,
            limit = 12
        } = req.query;

        const filter = { isActive: true };

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        if (category) {
            filter.category = category;
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        let sortOption = { createdAt: -1 }; // default: newest first
        if (sort === "price_asc") sortOption = { price: 1 };
        else if (sort === "price_desc") sortOption = { price: -1 };
        else if (sort === "rating") sortOption = { averageRating: -1 };
        else if (sort === "newest") sortOption = { createdAt: -1 };

        const pageNum = Math.max(1, Number(page));
        const limitNum = Math.max(1, Number(limit));
        const skip = (pageNum - 1) * limitNum;

        const [products, total] = await Promise.all([
            ProductModel.find(filter).sort(sortOption).skip(skip).limit(limitNum),
            ProductModel.countDocuments(filter)
        ]);

        api.success(res, {
            products,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum)
            }
        }, "Products fetched successfully!");
    } catch (error) {
        api.error(res, error, "Failed to fetch products");
    }
}

module.exports.UpdateProduct = async (req, res) => {
    try {
        const productid = req.params.id;
        const { name, price, Image, description, category, brand, stock, isActive } = req.body;

        if (!productid) throw new Error("product id Required !!");
        const data = {};

        if (name) data.name = name;
        if (price) data.price = price;
        if (Image) data.Image = Image;
        if (description) data.description = description;
        if (category) data.category = category;
        if (brand) data.brand = brand;
        if (stock !== undefined) data.stock = stock;
        if (isActive !== undefined) data.isActive = isActive;

        if (Object.keys(data).length === 0) {
            throw new Error("At least one field is required to update");
        }

        const updatedproduct = await ProductModel.findByIdAndUpdate(productid, data, { new: true });
        api.success(res, updatedproduct, "Product updated successfully!");
    } catch (error) {
        api.error(res, error, "Failed to update product");
    }
}

module.exports.DeleteProduct = async (req, res) => {
    try {
        const productid = req.params.id;
        const deletedProduct = await ProductModel.findByIdAndDelete(productid);
        api.success(res, deletedProduct, "Product deleted successfully!");
    } catch (error) {
        api.error(res, error, "Failed to delete product");
    }
}