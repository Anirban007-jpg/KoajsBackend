const Joi = require('joi');

const creditorSchema = Joi.object({
    Creditor_name : Joi.string().required(),
    Creditor_address: Joi.string().required(),
    Creditor_contact_no: Joi.string().max(10).required(),
    Creditor_email : Joi.string().email().required(),
    Creditor_Balance : Joi.number().required(),
});

const validateCreditor  = async (ctx, next) => {
    const { error } = creditorSchema.validate(ctx.request.body);

    if (error) {
        ctx.status = 400;
        ctx.body = { message: 'Validation Error', details: error.details.map(err => ({
            message: err.message,
        }))};
    } else {
        await next(); // Proceed to the next middleware/controller if validation passes
    }
};

module.exports = validateCreditor ;