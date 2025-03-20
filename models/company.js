
const mongoose = require('mongoose');
const crypto = require('crypto');


const companySchema = new mongoose.Schema({
    Company_Name: {
        type: String,
        unique: true,
        index: true,
    },
    TAN_No: {
        type: String,
        unique: true
    },
    Company_email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    profile: {
        type: String,
        required: true
    },
    CompanyLogo: {
        data: Buffer,
        contentType: String
    },
    password: {
        type: String
    },
    role: {
        type: String,
        default: 'Company'
    },
    resetPasswordLink: {
        data: String,
        default: ""
    },
    Company_address: {
        type: String
    },
    Company_contact_no: {
        type: String
    },
    no_of_directors: {
        type: Number
    },
    details_of_partners: {
        type: String
    },
    Acknowledgement_No:{
        type: String, 
        trim: true,
        upperCase: true
    },
    updated_on: {
        type: Date
    },
    registered_on: {
        type: Date,
        default: Date.now()
    },
    verification_code: {
        type: Number
    },
    email_verified : {
        type: Number,
        default: 0
    },
    Initials: {
        type: String
    },
 
}, {timestamp: true})


module.exports = mongoose.model('Company', companySchema);
