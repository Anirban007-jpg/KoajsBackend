const Ledger = require('../models/ledger')


exports.createLedger = async (ctx) => {
    const { Ledger_Name,Opening_Balance,type_of_ledger,balance_type,BS_Type_Item,PL_Type_Item } = ctx.request.body;
    try {
        const presentledger = await Ledger.findOne({ Name: ctx.request.body.Ledger_Name });
        if (!presentledger) {
            let Current_Balance= Opening_Balance;
            const newledger = new Ledger({ Ledger_Name,Opening_Balance,type_of_ledger,balance_type,BS_Type_Item,PL_Type_Item,Current_Balance: Current_Balance });
            await newledger.save();
            ctx.status = 200;
            ctx.body = { message: `${Ledger_Name} Created Successfully`, ledger: newledger };
        }
        else {
            console.log("Ledger alreay exists")
        }
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            // Handle duplicate key errors (e.g., unique fields)
            ctx.status = 409; // Conflict
            ctx.body = { message: 'Duplicate entry', error: 'Ledger Name already exists' };
        }
    }
};
