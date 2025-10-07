const Debtor = require('../models/debtor');
const { jwtDecode } = require("jwt-decode");
const Ledger = require('../models/ledger');

exports.createDebtor = async (ctx) => {
    const { Debtor_name, Debtor_address, Debtor_contact_no, Debtor_email, Debtor_balance } = ctx.request.body;
    try {
        const token = ctx.request.token;
        const authUserId = await jwtDecode(token);
        const individual = authUserId._id;
        const ledger = await Ledger.findOne({ Ledger_Name: "Debtor A/C" }); 
        // console.log(ledger)
        if (ledger) {
            const presentdebtor = await Debtor.findOne({ Name: ctx.request.body.Debtor_name });
            // console.log(presentdebtor)
            if (!presentdebtor) {
                const newdebtor = new Debtor({ Debtor_name, Debtor_address, Debtor_contact_no,Balance : {Previous_Balance: Debtor_balance, Previous_Balance_Date: Date.now()}, Debtor_email, Debtor_balance, individual, ledger: ledger._id,Debtor_Balance_Type : ledger.balance_type });
                await newdebtor.save();
                await Ledger.updateOne({Ledger_Name : "Debtor A/C"}, {Debtors: newdebtor._id});
                ctx.status = 200;
                ctx.body = { message: `${Debtor_name} Created Successfully`, debtor: newdebtor };
            }
            else {
                ctx.body = { message: `${Debtor_name} Already exsists` };
            }
        }
        else {
            ctx.body = { message: `Create Debtor Ledger A/C First`};
           
        }
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            // Handle duplicate key errors (e.g., unique fields)
            ctx.status = 409; // Conflict
            ctx.body = { message: 'Duplicate entry', error: 'Debtor already exists' };
        }
    }
};

exports.getDebtors = async (ctx) => {
    try {
        let debtors = await Debtor.find({});
        ctx.status = 200;
        ctx.body = { debtors };
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            // Handle duplicate key errors (e.g., unique fields)
            ctx.status = 409; // Conflict
            ctx.body = { message: 'Duplicate entry', error: 'Debtor  already exists' };
        }
    }
}

exports.updateDebtor = async (ctx) => {
    const { DebtorName, updateValue } = ctx.request.body;
    try {
        let debtors = await Ledger.findOne({ Debtor_name: DebtorName });
        await debtors.updateOne({ name: debtors.Debtor_name }, { Current_Balance: updateValue });
        ctx.status = 200;
        ctx.body = { message: `${debtors.Debtor_name} Updated`, debtors };
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            // Handle duplicate key errors (e.g., unique fields)
            ctx.status = 409; // Conflict
            ctx.body = { message: 'Duplicate entry', error: 'Debtor already exists' };
        }
    }
}

exports.deletedebtor = async (ctx) => {
    const { DebtorName } = ctx.request.body;
    try {
        let debtor = await Debtor.findOne({ Debtor_name: DebtorName });
        DebtorName = debtor.Debtor_name;
        await ledgers.deleteOne({ DebtorName });
        ctx.status = 200;
        ctx.body = { message: `${debtors.Debtor_name} Deleted` };
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            // Handle duplicate key errors (e.g., unique fields)
            ctx.status = 409; // Conflict
            ctx.body = { message: 'Duplicate entry', error: 'Debtor already exists' };
        }
    }
}