const { default: mongoose } = require("mongoose");
// const Double = require('@mongoosejs/double')
const { Int32 } = require('mongodb');

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
        default: Date.now()
    },
    Currency : {
        type: String,
        default: '&#8360;'
    },
    Closing_Balance_Date : {
        type: Date
    }
})


module.exports = mongoose.model('Ledger', ledgerScehma);