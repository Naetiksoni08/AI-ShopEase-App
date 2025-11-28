const joi = require("joi");

const productschemaValidator = joi.object({
    name: joi.string().trim().min(2).required().messages({
        "string.empty": "Product name is required",
        "string.min": "Product name must be at least 2 characters",
        "any.required": "Product name is required"
    }),
    price: joi.number().min(0).max(100000000).required().messages({
        "number.base": "Price must be a number",
        "number.min": "Price cannot be negative",
        "any.required": "Product price is required"
    }),

    Image: joi.string().trim().uri().required().messages({
        "string.empty": "Product image is required",
        "string.uri": "Image must be a valid URL",
        "any.required": "Product image is required"
    }),

    description: joi.string().allow("").optional().messages({
        "string.base": "Description must be text"
    }),
    category: joi.string().valid("electronics", "clothes", "shoes", "watches", "other").required(),
})


module.exports = {
    productschemaValidator
};