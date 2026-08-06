const mongoose = require('mongoose');

const CATEGORIES = ["Gaming", "Electronics", "Fashion", "Home", "Accessories"];

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        minlength: 2,
        required: [true, "Product name is required"]
    },
    price: {
        type: Number,
        min: 0,
        max: 100000000,
        required: [true, "Product price is required"]
    },
    Image: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        required: false,
    },
    category: {
        type: String,
        enum: CATEGORIES,
        required: [true, "Product category is required"],
        index: true
    },
    brand: {
        type: String,
        trim: true,
        default: "Generic"
    },
    stock: {
        type: Number,
        min: 0,
        default: 0
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    averageRating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    totalReviews: {
        type: Number,
        min: 0,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    reviews: [{
        type: mongoose.Types.ObjectId,
        ref: "review"
    }]
},
    {
        timestamps: true
    });

// text index for search on name + description
productSchema.index({ name: "text", description: "text" });

const ProductModel = mongoose.model('Product', productSchema);
module.exports = ProductModel;
module.exports.CATEGORIES = CATEGORIES;