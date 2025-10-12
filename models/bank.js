const mongoose = require('mongoose');
const crypto = require('crypto');
const { ObjectId } = require('mongodb');


const bankSchema = new mongoose.Schema({
    individual: {
        type: ObjectId,
        ref: 'Individual'
    },
    Bank_name: {
        type: String
    },
    Bank_address: {
        type: String,
    },
    Bank_IFSC: {
        type: String,
    },
    Bank_MICR: {
        type: String,
    },
    Bank_Account_No: {
        type: String
    },
    ledger: [{
        type: ObjectId,
        ref: 'Ledger'
    }],
    Balance: [{
        Previous_Balance: {
            type: Number
        },
        Previous_Balance_Date: {
            type: Date
        }
    }],
    Bank_Account_type: {
        type: String
    }
}, { timestamp: true })


module.exports = mongoose.model('Bank', bankSchema);
