const Creditor = require("../models/credior")
const { jwtDecode } = require("jwt-decode");

exports.createCreditor = async (ctx) => {
    const { Creditor_name,Creditor_adrress,Creditor_contact_no,Creditor_email,Creditor_Balance } = ctx.request.body;
    try {
        const token = ctx.request.token;
        const authUserId = await jwtDecode(token);
        const individual = authUserId._id;
        const presentcreditor = await Creditor.findOne({ Name: ctx.request.body.Debtor_name });
        if (!presentcreditor) {
            const newcreditor = new Creditor({ Creditor_name,Creditor_adrress,Creditor_contact_no,Creditor_email,Creditor_Balance,individual });
            await newcreditor.save();
            ctx.status = 200;
            ctx.body = { message: `${Creditor_name} Created Successfully`, debtor: newcreditor };
        }
        else {
            console.log("Creditor alreay exists");
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

// exports.updateCreditor= async (ctx) => {
//     const {DebtorName, updateValue} = ctx.request.body;
//     try{
//         let debtors = await Ledger.findOne({Debtor_name: DebtorName});
//         await debtors.updateOne({name : debtors.Debtor_name}, {Current_Balance: updateValue});
//         ctx.status = 200;
//         ctx.body = {  message: `${debtors.Debtor_name} Updated`, debtors };
//     } catch (error) {
//         console.log(error);
//         if (error.code === 11000) {
//             // Handle duplicate key errors (e.g., unique fields)
//             ctx.status = 409; // Conflict
//             ctx.body = { message: 'Duplicate entry', error: 'Ledger Name already exists' };
//         }
//     }
// }

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