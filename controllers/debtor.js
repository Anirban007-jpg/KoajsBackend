const Debtor = require('../models/debtor');
const { jwtDecode } = require("jwt-decode");
const math = require("mathjs");
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
            const presentdebtor = await Debtor.findOne({ Debtor_name: Debtor_name });
            // console.log(presentdebtor)
            if (!presentdebtor) {
                const newdebtor = new Debtor({ Debtor_name, Debtor_address, Debtor_contact_no,Balance : {Previous_Balance: Debtor_balance, Previous_Balance_Date: Date.now()}, Debtor_email, Debtor_balance, individual, ledger: ledger._id,Debtor_Balance_Type : ledger.balance_type });
                await newdebtor.save();
                await Ledger.findOneAndUpdate({Ledger_Name : "Debtor A/C"}, {$push : {Debtors: newdebtor._id}}, {upsert: true});
                ctx.status = 200;
                ctx.body = { message: `${Debtor_name} Created Successfully... Update Ledger Balance immediately`, debtor: newdebtor };
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
    try {
        let ledger = await Ledger.findOne({ Ledger_Name: "Debtor A/C" });
        // console.log(ledger);

        // console.log(ledger.Current_Balance);
        // console.log(ledger.Debtors[0]._id);

        let sum = 0;
        for (i=0; i<ledger.Debtors.length; i++){
            const result= await Debtor.findById({_id: ledger.Debtors[i]._id});
            // console.log(result);
            sum = math.add(sum,result.Debtor_balance);
            // console.log(sum);
        }
        // console.log(sum);
        let newSum = math.add(sum,ledger.Opening_Balance);
        if (math.add(ledger.Opening_Balance,sum) == ledger.Current_Balance){
            ctx.status = 200;
            ctx.body = { message: `Debtor Ledger already Updated`};
        }
        else{
            await Ledger.findOneAndUpdate({Ledger_Name: ledger.Ledger_Name}, {Current_Balance: newSum, $push : {Balance: {Previous_Balance: sum, Previous_Balance_Date: Date.now()}}});
            ctx.status = 200;
            ctx.body = { message: `Debtor Ledger Updated`};
        }

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