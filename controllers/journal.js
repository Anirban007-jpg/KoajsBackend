const Journal = require('../models/journal')
const Creditor = require("../models/credior")
const { jwtDecode } = require("jwt-decode");
const Ledger = require('../models/ledger');
const math = require("mathjs");
const Debtor = require('../models/debtor');
const { updateDebtor } = require('./debtor');

exports.createJournal = async (ctx) => {
    const { Debit_Item_AC, Credit_Item_AC, Amount_Deducted, Narration, Transaction_Date, Invoice_Date } = ctx.request.body;
    try {
        // const token = ctx.request.token;
        // const authUserId = await jwtDecode(token);
        // let individual = authUserId._id;

        if (Debit_Item_AC == "Cash A/C" && Credit_Item_AC == "Asset A/C") {
           

        } else if ("Debtor A/C".localeCompare(Debit_Item_AC) == 0   && "Sales A/C".localeCompare(Credit_Item_AC) == 0) {
            let trade_disc_amt = parseFloat(ctx.request.body.tda).toFixed(2);
            console.log(trade_disc_amt);
            // let tdair = math.multiply(trade_disc_amt,Amount_Deducted);
            // let newAmtDeducted = math.subtract(Amount_Deducted,tdair);
            // let cash_dis_amt = parseFloat(ctx.request.body.cda).toFixed(2);
            // let disc_allowed = math.multiply(cash_dis_amt, newAmtDeducted);
            // let debtor = await Debtor.findOne({Debtor_name: ctx.request.body.DN});
            // newAmtDeducted = math.subtract(newAmtDeducted, disc_allowed);
            // let Credit_Ledger = await Ledger.findOne({Ledger_Name : Credit_Item_AC});
            // let Debit_Ledger = await Ledger.findOne({Ledger_Name : Debit_Item_AC});
            // let newAmt= math.subtract(parseInt(debtor.Debtor_balance).toFixed(0),parseInt(newAmtDeducted));
            // if (Credit_Ledger.balance_type == "Cr"){
            //     let newcreditAmt = math.add(Credit_Ledger.Current_Balance,Amount_Deducted);
            //     await Ledger.updateOne({Ledger_Name: Credit_Item_AC}, {Current_Balance: parseInt(newcreditAmt).toFixed(0)}, {upsert: true})     
            // }else {
            //     let newcreditAmt = math.subtract(Credit_Ledger.Current_Balance,Amount_Deducted);
            //     if (newcreditAmt < 0){
            //         ctx.body = { message: `${Debtor_name} Already exsists` };
            //     }else{
            //     await Ledger.updateOne({Ledger_Name: Credit_Item_AC}, {Current_Balance: parseInt(newcreditAmt).toFixed(0)}, {upsert: true})
            //     }
            // }
            // await Debtor.updateOne({Debtor_name: debtor.Debtor_name}, {Debtor_balance: newAmt, Balance: {Previous_Balance: debtor.Debtor_balance, Previous_Balance_Date: debtor.Previous_Balance_Date}}, {upsert: true});
            // let ledger = await Ledger.findOne({ Ledger_Name: Debit_Item_AC });
            // let sum = 0;
            // for (i=0; i<ledger.Debtors.length; i++){
            //     const result= await Debtor.findById({_id: ledger.Debtors[i]._id});
            //     sum = math.add(sum,result.Debtor_balance);
            // }
            // let newSum = math.add(sum,ledger.Opening_Balance);
            // if (math.add(ledger.Opening_Balance,sum) == ledger.Current_Balance){
            //     ctx.status = 200;
            //     ctx.body = { message: `Debtor Ledger already Updated`};
            // }
            // else{
            //     await Ledger.findOneAndUpdate({Ledger_Name: ledger.Ledger_Name}, {Current_Balance: newSum, $push : {Balance: {Previous_Balance: sum, Previous_Balance_Date: Date.now()}}});
            //     ctx.status = 200;
            //     ctx.body = { message: `Debtor Ledger Updated`};
            // }
            // let journal = new Journal({individual, Debit_Item_AC, Credit_Item_AC, Amount_Deducted, Narration, Transaction_Date, Invoice_Date,individual});
            // await journal.save();
            // ctx.status = 200;
            // ctx.body = { message:`Journal Created Successfully`, journal };
        } else {

        }
    } catch (error) {
        console.log(error);
        // if (error.code === 11000) {
        //     // Handle duplicate key errors (e.g., unique fields)
        //     ctx.status = 409; // Conflict
        //     ctx.body = { message: 'Duplicate entry', error: 'Debtor already exists' };
        // }
    }
}