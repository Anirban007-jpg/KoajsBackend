
const mongoose = require('mongoose');
const crypto = require('crypto');


const individualSchema = new mongoose.Schema({
    Name: {
        type: String,
        unique: true,
        index: true,
    },
    PAN_No: {
        type: String,
        unique: true
    },
    Email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    profile: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    role: {
        type: String,
    },
    resetPasswordLink: {
        data: String
    },
    Address: {
        type: String
    },
    Contact_no: {
        type: String
    },
    Acknowledgement_No: {
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
    email_verified: {
        type: Number,
        default: 0
    },
    Initials: {
        type: String
    },
    photo: {
        data: Buffer,
        contentType: String
    }

}, { timestamp: true })


module.exports = mongoose.model('Individual', individualSchema);
