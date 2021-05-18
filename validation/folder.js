const Joi = require('joi');

const createValidation = data => {
    const schema = Joi.object({
        FolderName: Joi.string().required(),
        Parent: Joi.string()
    });
    return schema.validate(data);
}

const shareValidation = data => {
    const schema = Joi.object({
        FileId: Joi.string().required(),
        UserId: Joi.string().required()
    });
    return schema.validate(data);
}

module.exports.createValidation = createValidation;
module.exports.shareValidation = shareValidation;