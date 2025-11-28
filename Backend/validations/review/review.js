const joi = require("joi");

const ReviewschemaValidator = joi.object({
    text:joi.string().trim().min(1).required(),
    rating:joi.number().min(1).max(5).required().messages({
        "string.min": "rating must be at least 1 star",
    }),
})

module.exports = {
    ReviewschemaValidator
};