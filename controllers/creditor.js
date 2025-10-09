const Creditor = require("../models/credior")
const { jwtDecode } = require("jwt-decode");
const Ledger = require('../models/ledger');
const math = require("mathjs");

exports.createCreditor = async (ctx) => {
    const { Creditor_name,Creditor_address,Creditor_contact_no,Creditor_email,Creditor_Balance } = ctx.request.body;
    try {
        const token = ctx.request.token;
        const authUserId = await jwtDecode(token);
        const individual = authUserId._id;
        const ledger = await Ledger.findOne({ Ledger_Name: "Creditor A/C" }); 
        // console.log(ledger)
        if (ledger) {
            const presentcreditor = await Creditor.findOne({ Creditor_name: Creditor_name });
            // console.log(presentdebtor)
            if (!presentcreditor) {
                const newcreditor = new Creditor({ Creditor_name,Creditor_address,Creditor_contact_no,Creditor_email,Creditor_Balance,Balance : {Previous_Balance: Creditor_Balance, Previous_Balance_Date: Date.now()}, individual, ledger: ledger._id,Creditor_Balance_Type : ledger.balance_type });
                await newcreditor.save();
                await Ledger.findOneAndUpdate({Ledger_Name : "Creditor A/C"}, {$push : {Creditor: newcreditor._id}}, {upsert: true});
                ctx.status = 200;
                ctx.body = { message: `${Creditor_name} Created Successfully... Update Ledger Balance immediately`, creditor: newcreditor };
            }
            else {
                ctx.body = { message: `${Creditor_name} Already exsists` };
            }
        }
        else {
            ctx.body = { message: `Create Creditor Ledger A/C First`};
           
        }
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            // Handle duplicate key errors (e.g., unique fields)
            ctx.status = 409; // Conflict
            ctx.body = { message: 'Duplicate entry', error: 'Creditor already exists' };
        }
    }
};

exports.getCreditors = async (ctx) => {
    try{
        let creditors = await Creditor.find({});
        ctx.status = 200;
        ctx.body = { creditors };
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            // Handle duplicate key errors (e.g., unique fields)
            ctx.status = 409; // Conflict
            ctx.body = { message: 'Duplicate entry', error: 'Creditor already exists' };
        }
    }
}

exports.updateCreditor = async (ctx) => {
    try{
        let ledger = await Ledger.findOne({ Ledger_Name: "Creditor A/C" });
        // console.log(ledger);

        // console.log(ledger.Current_Balance);
        // console.log(ledger.Debtors[0]._id);

        let sum = 0;
        for (i=0; i<ledger.Creditors.length; i++){
            const result= await Creditor.findById({_id: ledger.Creditors[i]._id});
            // console.log(result);
            sum = math.add(sum,result.Creditor_Balance);
            // console.log(sum);
        }
        // console.log(sum);
        let newSum = math.add(sum,ledger.Opening_Balance);
        if (math.add(ledger.Opening_Balance,sum) == ledger.Current_Balance){
            ctx.status = 200;
            ctx.body = { message: `Creditor Ledger already Updated`};
        }
        else{
            await Ledger.findOneAndUpdate({Ledger_Name: ledger.Ledger_Name}, {Current_Balance: newSum, $push : {Balance: {Previous_Balance: sum, Previous_Balance_Date: Date.now()}}});
            ctx.status = 200;
            ctx.body = { message: `Creditor Ledger Updated`};
        }
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            // Handle duplicate key errors (e.g., unique fields)
            ctx.status = 409; // Conflict
            ctx.body = { message: 'Duplicate entry', error: error };
        }
    }
}

// exports.deleteLedgers = async (ctx) => {
//     const {LedgerName} = ctx.request.body;
//     try{
//         let ledgers = await Ledger.findOne({Ledger_Name: LedgerName});
//         LedgerName = ledgers.Ledger_Name;
//         await ledgers.deleteOne({LedgerName});
//         ctx.status = 200;
//         ctx.body = {  message: `${ledgers.Ledger_Name} Deleted`};
//     } catch (error) {
//         console.log(error);
//         if (error.code === 11000) {
//             // Handle duplicate key errors (e.g., unique fields)
//             ctx.status = 409; // Conflict
//             ctx.body = { message: 'Duplicate entry', error: 'Ledger Name already exists' };
//         }
//     }
// }