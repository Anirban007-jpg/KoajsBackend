const Joi = require('joi');

const debtorSchema = Joi.object({
    Debtor_name : Joi.string().required(),
    Debtor_adrress: Joi.string().required(),
    Debtor_contact_no: Joi.string().required(),
    Debtor_email : Joi.string().email().required(),
    Debtor_balance : Joi.number().required(),
});

const validateDebtor  = async (ctx, next) => {
    const { error } = debtorSchema.validate(ctx.request.body);

    if (error) {
        ctx.status = 400;
        ctx.body = { message: 'Validation Error', details: error.details.map(err => ({
            message: err.message,
        }))};
    } else {
        await next(); // Proceed to the next middleware/controller if validation passes
    }
};

module.exports = validateDebtor ;