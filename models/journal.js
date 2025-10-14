const mongoose = require('mongoose');
// const crypto = require('crypto');
const { ObjectId } = require('mongodb');
// const { type } = require('os');


const journalSchema = new mongoose.Schema({
    individual : {
        type: ObjectId,
        ref : 'Individual' 
    },
    Debit_Item_AC : {
        type: String
    },
    Credit_Item_AC : {
        type: String
    },
    Amount_Deducted : {
        type: Number
    },
    Narration :{
        type: String
    },
    Transaction_Date: {
        type: String
    },
    Invoice_Date : {
        type: String
    },
    Disc_Allowed: {
        type: Number
    },
    Disc_Received :{
        type: Number
    },
    profit_on_sale_of_asset : {
        type: Number     
    },
    loss_on_sale_of_asset : {
        type: Number
    }
}, {timestamp: true})


module.exports = mongoose.model('Journal', journalSchema);
