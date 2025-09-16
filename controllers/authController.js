// controllers/userController.js
const Individual = require('../models/individual')
const bcrypt = require('bcrypt');
const _ = require('lodash');
require('dotenv').config()
const jwt = require('jsonwebtoken');
const { expressjwt: ejwt } = require('express-jwt');

exports.createUser = async (ctx) => {
    const { PAN_No, password, Email, Address, Name, role } = ctx.request.body;
    try {
        const presentuser = await Individual.findOne({ Name: ctx.request.body.Name });
        if (!presentuser) {
            let gs = Name.replace(/[a-z]/g, '');
            let Initials = gs.replace(/\s+/g, '');
            let profile = `${process.env.CLIENT_URL}/Individual/profile/${Initials}`;
            var password1 = bcrypt.hashSync(password, 10);
            let Acknowledgement_No = _.times(15, () => _.random(35).toString(36)).join('').toUpperCase()
            const newUser = new Individual({ PAN_No, password: password1, Email, Address, Initials, profile, Acknowledgement_No, Name, role });
            await newUser.save();
            ctx.status = 200;
            ctx.body = { message: 'USer Registered Successfully', user: newUser };
        }
        else {
            console.log("User exists")
        }
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            // Handle duplicate key errors (e.g., unique fields)
            ctx.status = 409; // Conflict
            ctx.body = { message: 'Duplicate entry', error: 'Name already exists' };
        }
    }
};


exports.Loginuser = async (ctx) => {
    const { PAN_No, password } = ctx.request.body;
    try {
        let user = await Individual.findOne({ PAN_No: ctx.request.body.PAN_No });
        // console.log(user);
        
        var checked = bcrypt.compareSync(password, user.password);
        if (!checked){
            ctx.status = 400;
            ctx.body = "Password is wrong"
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        let Name = user.Name;
        let PAN_No = user.PAN_No;
        let Email = user.Email;
        let Initials = user.Initials;
        let Address = user.Address;
        let profile = user.profile;
        let Acknowledgement_No = user.Acknowledgement_No;
        let role = user.role;
        let email_verified = user.email_verified;

      
        return ctx.response.body = {
            token,
            user : {Name,PAN_No,Email,Initials,Address,profile,Acknowledgement_No,email_verified,role},
            token
        }

        
    }
    catch (error) {
        console.log(error);
        // if (error.code === 11000) {
        //     // Handle duplicate key errors (e.g., unique fields)
        //     ctx.status = 409; // Conflict
        //     ctx.body = { message: 'Duplicate entry', error: 'Name already exists' };
        // }
    }
}

exports.requireSignin = ejwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"], // added later
    credentialsRequired: false,
    requestProperty: "auth"
});

  
exports.signout = (req,res) => {
    res.clearCookie("token")
    res.json({
      message: 'Signout Success'
    })
}
