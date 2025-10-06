const Asset = require('../models/asset');
const { jwtDecode } = require("jwt-decode");

exports.createAssetw = async (ctx) => {
    const { Debtor_name,Debtor_adrress,Debtor_contact_no,Debtor_email,Debtor_balance } = ctx.request.body;
    try {
        const token = ctx.request.token;
        const authUserId = await jwtDecode(token);
        const individual = authUserId._id;
        const presentdebtor = await Debtor.findOne({ Name: ctx.request.body.Debtor_name });
        if (!presentdebtor) {
            const newdebtor = new Debtor({ Debtor_name,Debtor_adrress,Debtor_contact_no,Debtor_email,Debtor_balance ,individual });
            await newdebtor.save();
            ctx.status = 200;
            ctx.body = { message: `${Debtor_name} Created Successfully`, debtor: newdebtor };
        }
        else {
            console.log("Debtor alreay exists");
        }
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            // Handle duplicate key errors (e.g., unique fields)
            ctx.status = 409; // Conflict
            ctx.body = { message: 'Duplicate entry', error: 'Debtor already exists' };
        }
    }
};