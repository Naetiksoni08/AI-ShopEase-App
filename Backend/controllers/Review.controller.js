const reviewModel = require("../models/Review.models");
const ProductModel = require("../models/productSchema");
const api = require("../utils/api");



module.exports.CreateReview = async (req, res) => {
    try {
        const { text, rating } = req.body;

    
        const { productId } = req.params;

        if (!productId) return api.error(res, "Product Id required", 400);
        const review = await reviewModel.create({ text, rating, user: req.user.id });

        // console.log(req.user);

        const product = await ProductModel.findById(productId);
        if (!product) return api.error(res, "Product not Found", 404);

        product.reviews.push(review._id);
        await product.save();

        api.success(res, review, "Review submitted successfully!");

    } catch (error) {

        api.error(res, error)
    }
}





module.exports.getReviewsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await ProductModel.findById(productId)
        .populate({
            path: "reviews",
            populate: {
                path: "user",
                select: "username"
            }
        });
        if (!product) return api.error(res, "Product not found", 404);

        api.success(res, product.reviews, "Reviews fetched successfully");

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

        api.success(res, null, "Review deleted successfully");

    } catch (err) {

        api.error(res, err);
    }
};



