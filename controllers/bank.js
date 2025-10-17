const Bank = require('../models/bank');
const { jwtDecode } = require("jwt-decode");
const Ledger = require('../models/ledger');

exports.createbank = async (ctx) => {
    const {
        Bank_name,
        Bank_address,
        Bank_IFSC,
        Bank_MICR,      
        Bank_Account_type,
        Bank_Amt
    } = ctx.request.body;
    try {
        const token = ctx.request.token;
        const authUserId = await jwtDecode(token);
        const individual = authUserId._id;
        const presentbank = await Bank.findOne({ Bank_name: Bank_name });
        if (!presentbank) {
            const newbank = new Bank({
                Bank_name,
                Bank_address,
                Bank_IFSC,
                Bank_MICR,      
                Bank_Account_type,
                individual,
                Bank_Amt
            });
            await newbank.save();
            await Ledger.findOneAndUpdate({Ledger_Name : "Bank A/C"}, {$push : {Banks: newbank._id}}, {upsert: true});
            ctx.status = 200;
            ctx.body = { message: `${Bank_name} Created Successfully`};
        }
        else {
            console.log("Bank name already present");
        }
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            // Handle duplicate key errors (e.g., unique fields)
            ctx.status = 409; // Conflict
            ctx.body = { message: 'Duplicate entry', error: 'Bank already exists' };
        }
    }
};

exports.getBanks = async (ctx) => {
    try{
        let banks = await Bank.find({});
        ctx.status = 200;
        ctx.body = { banks };
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            // Handle duplicate key errors (e.g., unique fields)
            ctx.status = 409; // Conflict
            ctx.body = { message: 'Duplicate entry', error: 'Creditor already exists' };
        }
    }
}

exports.updateBank = async (ctx) => {
    try {
        let ledger = await Ledger.findOne({ Ledger_Name: "Bank A/C" });
        // console.log(ledger);

        // console.log(ledger.Current_Balance);
        // console.log(ledger.Debtors[0]._id);
   
        let sum = 0;
        for (i=0; i<ledger.Banks.length; i++){
            const result= await Debtor.findById({_id: ledger.Banks[i]._id});
            // console.log(result);
            sum = math.add(sum,result.Bank_Amt);
            // console.log(sum);
        }
        // console.log(sum);
        let newSum = math.add(sum,ledger.Opening_Balance);
        if (math.add(ledger.Opening_Balance,sum) == ledger.Current_Balance){
            ctx.status = 200;
            ctx.body = { message: `Bank Ledger already Updated`};
        }
        else{
            await Ledger.findOneAndUpdate({Ledger_Name: ledger.Ledger_Name}, {Current_Balance: newSum, $push : {Balance: {Previous_Balance: sum, Previous_Balance_Date: Date.now()}}});
            ctx.status = 200;
            ctx.body = { message: `Bank Ledger Updated`};
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