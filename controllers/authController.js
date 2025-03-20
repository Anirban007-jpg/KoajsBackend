// controllers/userController.js
const Individual = require('../models/individual')
const bcrypt = require('bcrypt');
const _ = require('lodash');
require('dotenv').config()

exports.createUser  = async (ctx) => {
    const { PAN_No, password, Email, confirmPassword, Address, Name, role } = ctx.request.body;

    try {
        

        let gs = Name.replace(/[a-z]/g, '');
        let Initials= gs.replace(/\s+/g, '');
        let profile = `${process.env.CLIENT_URL}/Individual/profile/${Initials}`;
    
        var password1 = bcrypt.hashSync(password,10);
        let Acknowledgement_No = _.times(15, () => _.random(35).toString(36)).join('').toUpperCase()
        const newUser  = new Individual({PAN_No, password:password1, Email, Address, Initials ,profile, Acknowledgement_No,Name,role });
        await newUser.save();
        ctx.status = 200;
        ctx.body = { message: 'User created successfully', user: newUser  };
    } catch (error) {
        if (error.code === 11000) {
            // Handle duplicate key errors (e.g., unique fields)
            ctx.status = 409; // Conflict
            ctx.body = { message: 'Duplicate entry', error: 'Name already exists' };
        }
    }
};