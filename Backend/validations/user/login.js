const joi = require("joi");


const userLoginValidator = joi.object({
    username: joi.string().trim().min(5).max(20).required(),
    password: joi.string().min(4).required(),
})
module.exports = {
    userLoginValidator
};