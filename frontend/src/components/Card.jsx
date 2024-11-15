import { FaLocationDot } from "react-icons/fa6";
import { BsCardText } from "react-icons/bs";
import { MdOutlinePayments } from "react-icons/md";
import {  FaTrash } from "react-icons/fa";
import { CiMoneyCheck1 } from "react-icons/ci";
import { HiPencilAlt } from "react-icons/hi";
import { Link } from "react-router-dom";
import { formDate } from "../utils/formateDate";
import toast from "react-hot-toast"
import { useMutation } from "@apollo/client";
import { DELETE_TRANSACTION } from "../graphql/mutations/transaction.mutation"
const categoryColorMap = {
    saving: "from-green-700 to-green-400",
    expense: "from-red-600 to-red-400",
    investment: "from-blue-700 to-blue-400",
    income: "from-yellow-500 to-yellow-300",
    entertainment: "from-purple-600 to-purple-400",
    education: "from-indigo-700 to-indigo-400",
    travel: "from-teal-600 to-teal-400",
    bills: "from-orange-600 to-orange-400",
    // Add more categories if needed
};


async function deleteHandler(){
try {
  const [deleteTransaction,{loading}]=  useMutation(DELETE_TRANSACTION,{
    refetchQueries:["GetTransactions"]
  })

   await deleteTransaction({
    variables:{
        transactionId: transaction._id
    }
   })
  toast.success("Transaction Delete Successfully")
} catch (error) {
    console.log(error);
    toast.error(error.message)
    
}
}

const Card = ({ transaction }) => {
    const { category, description, paymentType, amount, location, date } = transaction;
    const cardClass = categoryColorMap[category.toLowerCase()] || "from-gray-700 to-gray-500";
    const formattedDate = formDate(date);

    return (
        <div className={`rounded-md p-5 shadow-lg bg-gradient-to-br ${cardClass} transform transition-all duration-300 hover:scale-105`}>
            <div className="flex flex-col gap-3">
                {/* Category and Action Icons */}
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-bold text-white capitalize">{category}</h2>
                    <div className="flex items-center gap-2 text-white">
                        {!loading && <FaTrash onClick={deleteHandler} className="cursor-pointer hover:text-red-200" size={20} />}
                        {loading && <div className="w-6 h-6 border-t-2  rounded-full animate-spin"></div>}
                        <Link to={`/transaction/${transaction._id}`}>
                            <HiPencilAlt className="cursor-pointer hover:text-blue-200" size={20} />
                        </Link>
                    </div>
                </div>

                {/* Transaction Details */}
                <div className="space-y-1 text-white">
                    <p className="flex items-center gap-2 text-base">
                        <BsCardText /> {description.charAt(0).toUpperCase() + description.slice(1)}
                    </p>
                    <p className="flex items-center gap-2 text-base">
                        <MdOutlinePayments /> {paymentType.charAt(0).toUpperCase() + paymentType.slice(1)}
                    </p>
                    <p className="flex items-center gap-2 text-base">
                     <CiMoneyCheck1 /> ₹{amount}
                    </p>
                    <p className="flex items-center gap-2 text-base">
                        <FaLocationDot /> {location}
                    </p>
                </div>

                {/* Date and Avatar */}
                <div className="flex justify-between items-center pt-3 border-t border-white/30">
                    <p className="text-xs font-semibold text-gray-200">{formattedDate}</p>
                    <img
                        src="https://tecdn.b-cdn.net/img/new/avatars/2.webp"
                        className="h-8 w-8 border-2 border-white rounded-full"
                        alt="User Avatar"
                    />
                </div>
            </div>
        </div>
    );
};

export default Card;
