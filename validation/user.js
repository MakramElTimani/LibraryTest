const Joi = require('joi');

const registerValidation = data => {
    const schema = Joi.object({
        FirstName: Joi.string().min(6).required(),
        LastName: Joi.string().min(6).required(),
        Email: Joi.string().min(6).max(255).required().email(),
        Password: Joi.string().min(8).max(16).required(),
        ConfirmPassword: Joi.string().valid(Joi.ref('Password')).required()
    });
    return schema.validate(data);
}

const loginValidation = data => {
    const schema = Joi.object({
        Email: Joi.string().min(6).max(255).required().email(),
        Password: Joi.string().min(8).max(16).required()
    });
    return schema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;