const Joi = require('joi');

const individualSchema = Joi.object({
    Name: Joi.string().required(),
    password: Joi.string().min(6).max(12).required(),
    Email: Joi.string().email().required(),
    Address: Joi.string().min(10).max(100).required(),
    PAN_No: Joi.string().alphanum().min(0).max(10).required(),
    role: Joi.string().required(),

});

const validateUser  = async (ctx, next) => {
    const { error } = individualSchema.validate(ctx.request.body);

    if (error) {
        ctx.status = 400;
        ctx.body = { message: 'Validation Error', details: error.details.map(err => ({
            message: err.message,
        }))};
    } else {
        await next(); // Proceed to the next middleware/controller if validation passes
    }
};

module.exports = validateUser ;