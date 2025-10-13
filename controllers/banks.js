const Banks = require('../models/bank');
const { jwtDecode } = require("jwt-decode");

exports.createbank = async (ctx) => {
    const {
        Bank_name,
        Bank_address,
        Bank_IFSC,
        Bank_MICR,      
        Bank_Account_type
    } = ctx.request.body;
    try {
        const token = ctx.request.token;
        const authUserId = await jwtDecode(token);
        const individual = authUserId._id;
        const presentbank = await Bank.findOne({ Bank_name: Bank_name });
        if (!presentbank) {
            const newbank = new Bank({
                Bank_name,
                Bank_address,
                Bank_IFSC,
                Bank_MICR,      
                Bank_Account_type,
                individual
            });
            await newbank.save();
            await Ledger.findOneAndUpdate({Ledger_Name : "Bank A/C"}, {$push : {Banks: newbank._id}}, {upsert: true});
            ctx.status = 200;
            ctx.body = { message: `${Bank_name} Created Successfully`};
        }
        else {
            console.log("Bank name already present");
        }
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            // Handle duplicate key errors (e.g., unique fields)
            ctx.status = 409; // Conflict
            ctx.body = { message: 'Duplicate entry', error: 'Bank already exists' };
        }
    }
};