const joi = require("joi");


const productUpdateValidator = joi.object({
    name: joi.string().trim().min(2),
    price: joi.number().min(0).max(100000000),
    Image: joi.string().trim().uri(),
    description: joi.string().allow("")
}).min(1); // At least 1 field required


module.exports = { productUpdateValidator };

