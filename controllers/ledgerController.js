
const moment = require('moment');
const Ledger = require('../models/ledger')
const { isBefore, isSameDay } = require('date-fns');

exports.createLedger = async (ctx) => {
    const { Ledger_Name,Opening_Balance,type_of_ledger,balance_type,BS_Type_Item,PL_Type_Item } = ctx.request.body;
    try {
        const presentledger = await Ledger.findOne({ Ledger_Name: ctx.request.body.Ledger_Name });
        // console.log(presentledger);
        if (!presentledger) {
            let Current_Balance= Opening_Balance;
            const newledger = new Ledger({ Ledger_Name,Opening_Balance,type_of_ledger,balance_type,BS_Type_Item,PL_Type_Item,Current_Balance: Current_Balance });
            await newledger.save();
            ctx.status = 200;
            ctx.body = { message: `${Ledger_Name} Created Successfully`, ledger: newledger };
        }
        else {
            ctx.status = 401;
            ctx.body = { message: `${Ledger_Name} already Exsists` };
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

exports.getLedgers = async (ctx) => {
    try{
        let ledgers = await Ledger.find({});
        ctx.status = 200;
        ctx.body = ledgers;
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            // Handle duplicate key errors (e.g., unique fields)
            ctx.status = 409; // Conflict
            ctx.body = { message: 'Duplicate entry', error: 'Ledger Name already exists' };
        }
    }
}

exports.updateClosingBalanceLedgers = async (ctx) => {
    const {LedgerName} = ctx.request.body;
    try{
        let ledgers = await Ledger.findOne({Ledger_Name: LedgerName});
        // console.log(ledgers);
        let newDate = moment(new Date(Date.now())).format("DD-MM-YYYY");
        // console.log(newDate);
        if (isSameDay(newDate,"31-03-26")){
            // console.log("hellp");
            const ledgername = ledgers.Ledger_Name;
            let updatedledger = await Ledger.updateOne({Ledger_Name: ledgername}, {$set : {Closing_Balance: ledgers.Current_Balance}},{ upsert: true });
            ctx.status = 200;
            ctx.body = {  message: `${ledgers.Ledger_Name} Updated`, updatedledger };
        }else{
            ctx.body = {  message: `${ledgers.Ledger_Name} cannot be Updated` };
        }
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            // Handle duplicate key errors (e.g., unique fields)
            ctx.status = 409; // Conflict
            ctx.body = { message: 'Duplicate entry', error: 'Ledger Name already exists' };
        }
    }
}

exports.deleteLedgers = async (ctx) => {
    const {LedgerName} = ctx.request.body;
    try{
        let ledgers = await Ledger.findOne({Ledger_Name: LedgerName});
        
        LedgerName = ledgers.Ledger_Name;
        await ledgers.deleteOne({LedgerName});
        ctx.status = 200;
        ctx.body = {  message: `${ledgers.Ledger_Name} Deleted`};
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            // Handle duplicate key errors (e.g., unique fields)
            ctx.status = 409; // Conflict
            ctx.body = { message: 'Duplicate entry', error: 'Ledger Name already exists' };
        }
    }
}