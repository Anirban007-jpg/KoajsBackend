const Joi = require('joi');

const ledgerSchema = Joi.object({
    Ledger_Name : Joi.string().required(),
    Opening_Balance: Joi.number().required(),
    type_of_ledger: Joi.string().required(),
    balance_type: Joi.string().required(),
    BS_Type_Item : Joi.string().required(),
    PL_Type_Item: Joi.string().required(),
});

const validateLedger  = async (ctx, next) => {
    const { error } = ledgerSchema.validate(ctx.request.body);

    if (error) {
        ctx.status = 400;
        ctx.body = { message: 'Validation Error', details: error.details.map(err => ({
            message: err.message,
        }))};
    } else {
        await next(); // Proceed to the next middleware/controller if validation passes
    }
};

module.exports = validateLedger ;