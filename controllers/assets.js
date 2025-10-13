const Asset = require('../models/asset');
const { jwtDecode } = require("jwt-decode");

exports.createAsset = async (ctx) => {
    const {
        Asset_name,
        Asset_Type,
        Asset_Lifetime,
        Opening_Book_Value,
        Accumulated_Depreciation,
        Depreciation_Charged_CY,
        Scrap_Value
    } = ctx.request.body;
    try {
        const token = ctx.request.token;
        const authUserId = await jwtDecode(token);
        const individual = authUserId._id;
        const presentmachinery = await Asset.findOne({ Asset_name: Asset_name });
        if (!presentmachinery) {
            const newmachinery = new Asset({
                Asset_name,
                Asset_Type,
                Asset_Lifetime,
                Opening_Book_Value,
                Accumulated_Depreciation,
                Depreciation_Charged_CY,
                Scrap_Value,
                individual
            });
            await newmachinery.save();
            ctx.status = 200;
            await Ledger.findOneAndUpdate({Ledger_Name : "Asset A/C"}, {$push : {Assets: newmachinery._id}}, {upsert: true});
            ctx.body = { message: `${Asset_name} Created Successfully`};
        }
        else {
            console.log("Asset of name with such class already exsists... please create asset name more ditinctively");
        }
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            // Handle duplicate key errors (e.g., unique fields)
            ctx.status = 409; // Conflict
            ctx.body = { message: 'Duplicate entry', error: 'Asset already exists' };
        }
    }
};