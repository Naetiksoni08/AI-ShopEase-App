const reviewModel = require("../models/Review.models");
const ProductModel = require("../models/productSchema");
const OrderModel = require("../models/Order.model");
const api = require("../utils/api");
const { calculateAverageRating } = require("../utils/calculateRating");

async function recalculateProductRating(productId) {
    const reviews = await reviewModel.find({ product: productId });
    const { averageRating, totalReviews } = calculateAverageRating(reviews);
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

        // populate before responding so the frontend gets the username immediately,
        // instead of showing "Anonymous" until the next full refetch
        await review.populate("user", "username");

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

        const review = await reviewModel.findById(reviewId);
        if (!review) return api.error(res, "Review not found", 404);

        // Ownership check: only the person who wrote the review can delete it
        if (review.user.toString() !== req.user.id) {
            return api.error(res, "You can only delete your own reviews", 403);
        }

        await reviewModel.findByIdAndDelete(reviewId);

        const product = await ProductModel.findById(productId);
        if (product) {
            product.reviews = product.reviews.filter(id => id.toString() !== reviewId);
            await product.save();
        }

        await recalculateProductRating(productId);

        api.success(res, null, "Review deleted successfully");
    } catch (err) {
        api.error(err);
    }
};