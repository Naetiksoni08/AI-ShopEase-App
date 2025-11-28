const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        min: 2,
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
        required: [false, 'Product description is not required'],
    },
    reviews: [{
        type: mongoose.Types.ObjectId,
        ref: "review"
    }]


},
    {
        timestamps: true
    });

const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel;
