const { default: mongoose } = require("mongoose");
// const Double = require('@mongoosejs/double')
var moment = require('moment');
const { Int32 } = require('mongodb');
const { ObjectId } = require('mongodb');

const ledgerScehma = new mongoose.Schema({
    Ledger_Name : {
        type: String
    },
    Opening_Balance : {
        type: Number,   
    },
    type_of_ledger : {
        type:  String
    },
    balance_type : {
        type: String
    },
    Current_Balance : {
        type: Number
    },
    Closing_Balance : {
        type: Number,   
    },
    BS_Type_Item : {
        type: String
    },
    PL_Type_Item : {
        type: String
    },
    Opening_Balance_Date : {
        type: Date,
        default: () => new Date(Date.now())
    },
    Currency : {
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
    Debtors : [{
        type: ObjectId,
        ref : "Debtor"
    }],
    Creditors : [{
        type: ObjectId,
        ref : "Creditor"
    }],
    Closing_Balance_Date : {
        type: Date
    }
})


module.exports = mongoose.model('Ledger', ledgerScehma);