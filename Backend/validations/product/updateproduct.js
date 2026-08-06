const joi = require("joi");

const productUpdateValidator = joi.object({
    name: joi.string().trim().min(2),
    price: joi.number().min(0).max(100000000),
    Image: joi.string().trim().uri(),
    description: joi.string().allow(""),
    category: joi.string().valid("Gaming", "Electronics", "Fashion", "Home", "Accessories"),
    brand: joi.string().trim(),
    stock: joi.number().min(0),
    isActive: joi.boolean()
}).min(1);

module.exports = { productUpdateValidator };