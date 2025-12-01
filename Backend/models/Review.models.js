const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    text: {
        type: String,
        trim:true,
        min:1,
        required: [true, "product review is required"]
    },

    rating: {
        type: Number,
        min:1,
        max: 5,
        required: [true, "product rating is required"]
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
},
    {
        timestamps: true
    });

const reviewModel = mongoose.model('review', reviewSchema);

module.exports = reviewModel;

