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
        type: Date,
    },
    Invoice_Date : {
        type: Date
    },
    Disc_Allowed: {
        type: Number
    },
    Disc_Received :{
        type: Number
    }
}, {timestamp: true})


module.exports = mongoose.model('Journal', journalSchema);
