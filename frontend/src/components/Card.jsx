import { FaLocationDot } from "react-icons/fa6";
import { BsCardText } from "react-icons/bs";
import { MdOutlinePayments } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { CiMoneyCheck1 } from "react-icons/ci";
import { HiPencilAlt } from "react-icons/hi";
import { Link } from "react-router-dom";
import { formDate } from "../utils/formateDate";
import toast from "react-hot-toast";
import { useMutation } from "@apollo/client";
import { DELETE_TRANSACTION } from "../graphql/mutations/transaction.mutation";

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

const Card = ({ transaction, authUser }) => {
  const { category, description, paymentType, amount, location, date } = transaction;
  const cardClass = categoryColorMap[category.toLowerCase()] || "from-gray-700 to-gray-500";
  const formattedDate = formDate(date);

  const [deleteTransaction, { loading }] = useMutation(DELETE_TRANSACTION, {
    refetchQueries: ["GetTransactions"],
    onCompleted: () => {
      toast.success("Transaction deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteHandler = async (transactionId) => {
    try {
      await deleteTransaction({
        variables: { transactionId },
      });
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting the transaction.");
    }
  };

  return (
    <div
      className={`rounded-xl p-6 sm:p-8 shadow-xl bg-gradient-to-br ${cardClass} transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl max-w-md sm:max-w-2xl mx-auto`}
    >
      <div className="flex flex-col gap-6">
        {/* Header: Category and Actions */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg sm:text-2xl font-bold text-white capitalize">{category}</h2>
          <div className="flex items-center gap-4 text-white">
            {!loading ? (
              <FaTrash
                onClick={() => deleteHandler(transaction._id)}
                className="cursor-pointer hover:text-red-300 transition duration-200"
                size={24}
              />
            ) : (
              <div className="w-6 h-6 border-t-2 border-white rounded-full animate-spin"></div>
            )}
            <Link to={`/transaction/${transaction._id}`}>
              <HiPencilAlt
                className="cursor-pointer hover:text-blue-300 transition duration-200"
                size={24}
              />
            </Link>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white">
          <p className="flex items-center gap-3 text-sm sm:text-lg">
            <BsCardText /> {description.charAt(0).toUpperCase() + description.slice(1)}
          </p>
          <p className="flex items-center gap-3 text-sm sm:text-lg">
            <MdOutlinePayments /> {paymentType.charAt(0).toUpperCase() + paymentType.slice(1)}
          </p>
          <p className="flex items-center gap-3 text-sm sm:text-lg">
            <CiMoneyCheck1 /> ₹{amount}
          </p>
          <p className="flex items-center gap-3 text-sm sm:text-lg">
            <FaLocationDot /> {location}
          </p>
        </div>

        {/* Footer: Date and Avatar */}
        <div className="flex justify-between items-center pt-6 border-t border-white/30">
          <p className="text-xs sm:text-sm text-gray-200">{formattedDate}</p>
          <img
            src={authUser?.profilePicture}
            className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-white rounded-full transition-transform duration-200 hover:scale-110"
            alt="User Avatar"
          />
        </div>
      </div>
    </div>
  );
};

export default Card;
