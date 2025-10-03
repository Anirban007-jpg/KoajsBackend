const mongoose = require('mongoose');
const crypto = require('crypto');
const { ObjectId } = require('mongodb');



const assetSchema = new mongoose.Schema({
    individual : [{
        type: ObjectId,
        ref : 'Individual' 
    }],
    Asset_name: {
        type: String,
    },
    Asset_Type : {
        type : String,
    },
    Asset_Lifetime : {
        type : String,
    },
    Opening_Book_Value : {
        type : Number,
    },
    Opening_Book_Value : {
        type: Number
    },
    Asset_Currency : {
        type: String,
        default: 'Rs'
    },
    Accumulated_Depreciation : {
        type: Number
    },
    Depreciation_Charged_CY : {
        type: Number
    },
    Scrap_Value : {
        type: Number
    },
    Asset_Closing_Value_Date : {
        type: Date
    },
    Asset_Opening_Value_Date : {
        type: Date,
        default: Date.now()
    }
    
}, {timestamp: true})


module.exports = mongoose.model('Asset', assetSchema);
