const Journal = require('../models/journal')
const Creditor = require("../models/credior")
const { jwtDecode } = require("jwt-decode");
const Ledger = require('../models/ledger');
const math = require("mathjs");
const Debtor = require('../models/debtor');
const { updateDebtor } = require('./debtor');
const { updateCreditor } = require('./creditor');

exports.createJournal = async (ctx) => {
    const { Debit_Item_AC, Credit_Item_AC, Amount_Deducted, Narration, Transaction_Date, Invoice_Date } = ctx.request.body;
    try {
        // const token = ctx.request.token;
        // const authUserId = await jwtDecode(token);
        // let individual = authUserId._id;

        // asset case

        if ("Debtor A/C".localeCompare(Debit_Item_AC) == 0 && "Sales A/C".localeCompare(Credit_Item_AC) == 0) {
            // speacial case 1
            // console.log(this)
            let trade_disc_amt = parseFloat(ctx.request.body.tda).toFixed(2);
            let tdair = math.multiply(trade_disc_amt, Amount_Deducted);
            let newAmtDeductedaftertdir = math.subtract(Amount_Deducted, tdair);
            let cash_dis_amt = parseFloat(ctx.request.body.cda).toFixed(2);
            let disc_allowed = math.multiply(cash_dis_amt, newAmtDeductedaftertdir);
            let debtor = await Debtor.findOne({ Debtor_name: ctx.request.body.DN });
            let newAmtDeducted = 0;
            newAmtDeducted = math.subtract(newAmtDeductedaftertdir, disc_allowed);
            let Credit_Ledger = await Ledger.findOne({ Ledger_Name: Credit_Item_AC });
            let Debit_Ledger = await Ledger.findOne({ Ledger_Name: Debit_Item_AC });
            let newAmt = math.add(parseInt(debtor.Debtor_balance), parseInt(newAmtDeducted));
            if (Credit_Ledger.balance_type == "Cr" && Credit_Ledger.Ledger_Name == "Sales A/C") {
                let newcreditAmt = math.add(Credit_Ledger.Current_Balance, newAmtDeductedaftertdir);
                await Ledger.updateOne({ Ledger_Name: Credit_Item_AC }, { Current_Balance: parseInt(newcreditAmt).toFixed(0) }, { upsert: true })
            } else {
                let newcreditAmt = math.subtract(Credit_Ledger.Current_Balance, newAmtDeductedaftertdir);
                if (newcreditAmt < 0) {
                    ctx.body = { message: `Balance cannot be less than 0` };
                } else {
                    await Ledger.updateOne({ Ledger_Name: Credit_Ledger.Ledger_Name }, { Current_Balance: parseInt(newcreditAmt).toFixed(0) }, { upsert: true })
                }
            }
            await Debtor.updateOne({ Debtor_name: debtor.Debtor_name }, { Debtor_balance: newAmt, $push: { Balance: { Previous_Balance: debtor.Debtor_balance, Previous_Balance_Date: debtor.Previous_Balance_Date } } }, { upsert: true });
            let ledger = await Ledger.findOne({ Ledger_Name: Debit_Item_AC });
            let sum = 0;
            for (i = 0; i < ledger.Debtors.length; i++) {
                const result = await Debtor.findById({ _id: ledger.Debtors[i]._id });
                sum = math.add(sum, result.Debtor_balance);
            }
            let newSum = math.add(sum, ledger.Opening_Balance);
            if (math.add(ledger.Opening_Balance, sum) == ledger.Current_Balance) {
                ctx.status = 200;
                ctx.body = { message: `Debtor Ledger already Updated` };
            }
            else {
                await Ledger.findOneAndUpdate({ Ledger_Name: ledger.Ledger_Name }, { Current_Balance: newSum, $push: { Balance: { Previous_Balance: sum, Previous_Balance_Date: Date.now() } } });
                ctx.status = 200;
                ctx.body = { message: `Debtor Ledger Updated` };
            }

            console.log(disc_allowed)
            let journal = new Journal({ Debit_Item_AC, Credit_Item_AC, Amount_Deducted: newAmtDeductedaftertdir, Narration, Transaction_Date, Invoice_Date, Disc_Allowed: disc_allowed });
            await journal.save();
            ctx.status = 200;
            ctx.body = { message: `Journal Created Successfully`, journal };
        } else if ("Purchase A/C".localeCompare(Debit_Item_AC) == 0 && "Creditor A/C".localeCompare(Credit_Item_AC) == 0) {
            //speacial case 2
            let cash_dis_amt = parseFloat(ctx.request.body.cdr).toFixed(2);
            let disc_recieved = math.multiply(cash_dis_amt, Amount_Deducted);
            let creditor = await Creditor.findOne({ Creditor_name: ctx.request.body.CN });
            // console.log(creditor)
            let newAmtDeducted = 0;
            newAmtDeducted = math.subtract(Amount_Deducted, disc_recieved);
            let Credit_Ledger = await Ledger.findOne({ Ledger_Name: Credit_Item_AC });
            let Debit_Ledger = await Ledger.findOne({ Ledger_Name: Debit_Item_AC });
            let newAmt = math.add(parseInt(creditor.Creditor_Balance), parseInt(newAmtDeducted));
            if (Debit_Ledger.balance_type == "Dr" && Credit_Ledger.Ledger_Name == "Purchase A/C") {
                let newdebitAmt = math.add(Credit_Ledger.Current_Balance, newAmtDeducted);
                await Ledger.updateOne({ Ledger_Name: Debit_Item_AC }, { Current_Balance: parseInt(newdebitAmt).toFixed(0) }, { upsert: true })
            } else {
                let newdebitAmt = math.subtract(Credit_Ledger.Current_Balance, newAmtDeducted);
                if (newdebitAmt < 0) {
                    ctx.body = { message: `Balance cannot be less than 0` };
                } else {
                    await Ledger.updateOne({ Ledger_Name: Debit_Ledger.Ledger_Name }, { Current_Balance: parseInt(newdebitAmt).toFixed(0) }, { upsert: true })
                }
            }
            await Creditor.updateOne({ Creditor_name: creditor.Creditor_name }, { Creditor_Balance: newAmt, Balance: { Previous_Balance: creditor.Creditor_Balance, Previous_Balance_Date: creditor.Previous_Balance_Date }, }, { upsert: true });
            let ledger = await Ledger.findOne({ Ledger_Name: "Creditor A/C" });
            // console.log(ledger);

            // console.log(ledger.Current_Balance);
            // console.log(ledger.Debtors[0]._id);

            let sum = 0;
            for (i = 0; i < ledger.Creditors.length; i++) {
                const result = await Creditor.findById({ _id: ledger.Creditors[i]._id });
                // console.log(result);
                sum = math.add(sum, result.Creditor_Balance);
                // console.log(sum);
            }
            // console.log(sum);
            let newSum = math.add(sum, ledger.Opening_Balance);
            if (math.add(ledger.Opening_Balance, sum) == ledger.Current_Balance) {
                ctx.status = 200;
                ctx.body = { message: `Creditor Ledger already Updated` };
            }
            else {
                await Ledger.findOneAndUpdate({ Ledger_Name: ledger.Ledger_Name }, { Current_Balance: newSum, $push: { Balance: { Previous_Balance: sum, Previous_Balance_Date: Date.now() } } });
                ctx.status = 200;
                ctx.body = { message: `Creditor Ledger Updated` };
            }
            let journal = new Journal({ Debit_Item_AC, Credit_Item_AC, Amount_Deducted: newAmtDeducted, Narration, Transaction_Date, Invoice_Date, Disc_Received: disc_recieved });
            await journal.save();
            ctx.status = 200;
            ctx.body = { message: `Journal Created Successfully`, journal };
        } else {
            // normal case 
            let Credit_Ledger = await Ledger.findOne({ Ledger_Name: Credit_Item_AC });
            let Debit_Ledger = await Ledger.findOne({ Ledger_Name: Debit_Item_AC });
            let newcreditAmt = 0;
            let newdebitAmt = 0;
            if (Credit_Ledger.balance_type == "Cr") {
                newcreditAmt = math.add(Credit_Ledger.Current_Balance, Amount_Deducted);
                await Ledger.updateOne({ Ledger_Name: Credit_Item_AC }, {$set : { Current_Balance: newcreditAmt }}, { upsert: true })
            } else {
                newcreditAmt = math.subtract(Credit_Ledger.Current_Balance, Amount_Deducted);
                if (newcreditAmt < 0) {
                    ctx.body = { error: `Balance cannot be less than 0` };
                } else {
                    await Ledger.updateOne({ Ledger_Name: Credit_Ledger.Ledger_Name }, {$set : { Current_Balance: newcreditAmt }}, { upsert: true })
                }
            }
            if (Debit_Ledger.balance_type == "Dr") {
                newdebitAmt = math.add(Debit_Ledger.Current_Balance, Amount_Deducted);
                // console.log(newdebitAmt)
                await Ledger.updateOne({ Ledger_Name: Debit_Item_AC }, { Current_Balance: newdebitAmt }, { upsert: true })
            } else {
                newdebitAmt = math.subtract(Debit_Ledger.Current_Balance, Amount_Deducted);
                if (newdebitAmt < 0) {
                    ctx.body = { error: `Balance cannot be less than 0` };
                } else {
                    await Ledger.updateOne({ Ledger_Name: Debit_Ledger.Ledger_Name }, { Current_Balance:  newdebitAmt }, { upsert: true })
                }
            }
            let journal = new Journal({ Debit_Item_AC, Credit_Item_AC, Amount_Deducted, Narration, Transaction_Date, Invoice_Date });
            await journal.save();
            ctx.status = 200;
            ctx.body = { message: `Journal Created Successfully`, journal };
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