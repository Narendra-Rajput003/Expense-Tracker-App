
import Transaction from "../models/transaction.model.js";


const transactionResolver={
    Query:{
        transactions:async (_,__,context)=>{
            try{
                if(!context.getUser()) throw new Error("Unauthorized");
                const userId=await  context.getUser()._id;
                console.log("userId",userId);

                const transactions = await Transaction.find({ userId});
                return transactions;

            }catch (e) {
              console.error(e)
              throw new Error(e.message);
            }
        },
        transaction:async (_,{transactionId})=>{
            try{
                const FindTransactionById=await Transaction.findById(transactionId);
                if(!FindTransactionById){
                    throw new Error("Transaction ID not found");
                }
                return FindTransactionById;
            }catch (e){
                throw new Error(e.message);
            }
        },
        categoryStatistics:async(_,__,context)=> {
            try {
                if(!context.getUser()) throw new Error("Unauthorized");
                const userId=await  context.getUser()._id;
                const transactions = await Transaction.find({ userId });

                const categoryMap={};

                // const transactions = [
			// 	{ category: "expense", amount: 50 },   //enpense == totalamount (125)
			// 	{ category: "expense", amount: 75 },
			// 	{ category: "investment", amount: 100 },
			// 	{ category: "saving", amount: 30 },
			// 	{ category: "saving", amount: 20 }
			// ];

                transactions.forEach((transaction)=>{
                     if(!categoryMap[transaction.category]){
                        categoryMap[transaction.category]=0;
                     }
                    categoryMap[transaction.category] +=transaction.amount
                })

                // categoryMap = { expense: 125, investment: 100, saving: 50 }

                return Object.entries(categoryMap).map(([category,totalAmount])=>({category,totalAmount}));
                // return [ { category: "expense", totalAmount: 125 }, { category: "investment", totalAmount: 100 }, { category: "saving", totalAmount: 50 } ]

            } catch (error) {
                throw new Error(error.message)
            
       
            }
        }

    },
    Mutation:{
        createTransaction:async(_,{input},context)=>{
            try {

                if (!context.getUser()) {
                    throw new Error('Authentication required');
                }

                const NewTransaction=new Transaction({
                    ...input,
                    userId: context.getUser()._id,
                })
                await  NewTransaction.save();
                return NewTransaction;


            }catch (e) {
                console.log(e);
                throw new Error(e.message);
            }
        },
        updateTransaction:async (_,{input})=>{
            try{

                const updatedTransaction=await Transaction.findByIdAndUpdate(input.transactionId,input,{
                    new:true
                })
                return updatedTransaction;


            }catch (e) {
                console.log(e.message);
                throw new Error("Error in Update Transaction")
            }
        },
        deleteTransaction: async (_, { transactionId }) => {
            try {
                const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);
                return deletedTransaction;
            } catch (err) {
                console.error("Error deleting transaction:", err);
                throw new Error("Error deleting transaction");
            }
        },

    }

}

export default  transactionResolver;