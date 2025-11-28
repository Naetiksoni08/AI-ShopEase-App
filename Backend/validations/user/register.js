const joi = require("joi");

const userRegisterValidator = joi.object({
    username: joi.string().trim().min(5).max(20).pattern(/.*[A-Za-z].*/).required().messages({
        "string.empty": "Username is required",
        "string.min": "Username must be at least 5 characters",
        "string.pattern.base": "Username must only be alphabet",
    }),
    email: joi.string().email().messages({
        "string.email": "Invalid email",
        "any.required": "Email is required",
    }),
    password: joi.string().min(4).required().messages({
        "string.min": "Password must be at least 4 characters",
        "any.required": "Password is required",
    }),
    role: joi.string().valid("buyer", "seller").required().messages({
        "any.only": "Role must be either buyer or seller",
        "string.empty": "Role is required"
    })

})

module.exports = {
    userRegisterValidator
};