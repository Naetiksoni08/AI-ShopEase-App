const reviewModel = require("../models/Review.models");
const ProductModel = require("../models/productSchema");
const OrderModel = require("../models/Order.model");
const api = require("../utils/api");

async function recalculateProductRating(productId) {
    const reviews = await reviewModel.find({ product: productId });
    const totalReviews = reviews.length;
    const averageRating = totalReviews
        ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
        : 0;
    await ProductModel.findByIdAndUpdate(productId, { averageRating, totalReviews });
}

module.exports.CreateReview = async (req, res) => {
    try {
        const { text, rating } = req.body;
        const { productId } = req.params;

        if (!productId) return api.error(res, "Product Id required", 400);

        const product = await ProductModel.findById(productId);
        if (!product) return api.error(res, "Product not Found", 404);

        const verifiedPurchase = await OrderModel.exists({ userId: req.user.id, productId });

        const review = await reviewModel.create({
            text,
            rating,
            user: req.user.id,
            product: productId,
            verifiedPurchase: !!verifiedPurchase
        });

        product.reviews.push(review._id);
        await product.save();

        await recalculateProductRating(productId);

        api.success(res, review, "Review submitted successfully!");
    } catch (error) {
        api.error(res, error);
    }
}

module.exports.getReviewsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        // now querying directly on Review, not going through product.reviews populate
        const reviews = await reviewModel.find({ product: productId })
            .populate("user", "username")
            .sort({ createdAt: -1 });

        api.success(res, reviews, "Reviews fetched successfully");
    } catch (error) {
        api.error(res, error);
    }
};

module.exports.DeleteReview = async (req, res) => {
    try {
        const { reviewId, productId } = req.params;

        const review = await reviewModel.findByIdAndDelete(reviewId);
        if (!review) return api.error(res, "Review not found", 404);

        const product = await ProductModel.findById(productId);
        if (product) {
            product.reviews = product.reviews.filter(id => id.toString() !== reviewId);
            await product.save();
        }

        await recalculateProductRating(productId);

        api.success(res, null, "Review deleted successfully");
    } catch (err) {
        api.error(res, err);
    }
};