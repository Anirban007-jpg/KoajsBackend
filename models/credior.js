const mongoose = require('mongoose');
const crypto = require('crypto');
const { ObjectId } = require('mongodb');


const creditorSchema = new mongoose.Schema({
    individual : [{
        type: ObjectId,
        ref : 'Individual' 
    }],
    Creditor_name: {
        type: String,
    },
    Creditor_adrress : {
        type : String,
    },
    Creditor_contact_no : {
        type : String,
    },
    Creditor_email : {
        type : String,
    },
    Creditor_Balance : {
        type: Number
    },
    Creditor_Currency : {
        type: String,
        default: 'Rs'
    },
    Previous_Balance :[{
        type: Number
    }],
    Previous_Balance_Date :[{
        type: Date
    }],
    
    
}, {timestamp: true})


module.exports = mongoose.model('Creditor', creditorSchema);
