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
    Creditor_address : {
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
    Balance : [{
        Previous_Balance : {
            type: Number
        },
        Previous_Balance_Date : {
            type: Date
        }
    }],
    ledger : [{
        type: ObjectId,
        ref : 'Ledger' 
    }],
    
}, {timestamp: true})


module.exports = mongoose.model('Creditor', creditorSchema);
