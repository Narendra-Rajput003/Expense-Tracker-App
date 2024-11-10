import mongoose from "mongoose";


const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    description:{
        type:String,
        required:true

    },
    paymentType:{
        type:String,
        enum:["CreditCard","DebitCard","NetBanking","GooglePay","Paytm"],
        required:true
    },
    category:{
        type:String,
        required:true,
        enum:["saving","expense","investment","income","entertainment","education","travel","bills"]
    },
    amount:{
        type:Number,
        required:true

    },
    location:{
        type:String,
        default:"Unknown"
    },
    date:{
        type:Date,
        required:true
    }
})

const Transaction = mongoose.model("Transaction",transactionSchema);
export default  Transaction;