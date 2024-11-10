import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { CREATE_TRANSACTION } from "../graphql/mutations/transaction.mutation";
import toast from "react-hot-toast";

const TransactionForm = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [createTransaction, { loading }] = useMutation(CREATE_TRANSACTION, {
    refetchQueries: ["GetTransactions", "GetTransactionStatistics"],
  });

  const onSubmit = async (transactionData) => {
    try {
      await createTransaction({ variables: { input: transactionData } });
      reset();
      toast.success("Transaction created successfully");
    } catch (error) {
      toast.error("Failed to create transaction. Please try again.");
    }
  };

  return (
    <form className="w-full max-w-lg flex flex-col gap-5 px-3" onSubmit={handleSubmit(onSubmit)}>
      {/* TRANSACTION DESCRIPTION */}
      <div className="flex flex-wrap">
        <div className="w-full">
          <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="description">
            Transaction
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="description"
            placeholder="Rent, Groceries, Salary, etc."
            disabled={loading}
            {...register("description", { required: "Description is required" })}
          />
          {errors.description && <p className="text-red-500 text-xs italic">{errors.description.message}</p>}
        </div>
      </div>

      {/* PAYMENT TYPE */}
      <div className="flex flex-wrap gap-3">
        <div className="w-full flex-1 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="paymentType">
            Payment Type
          </label>
          <select
            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="paymentType"
            disabled={loading}
            {...register("paymentType", { required: "Please select a payment type" })}
          >
            <option value="CreditCard">Credit Card</option>
            <option value="DebitCard">Debit Card</option>
            <option value="NetBanking">Net Banking</option>
            <option value="GooglePay">Google Pay</option>
            <option value="Paytm">Paytm</option>
          </select>
          {errors.paymentType && <p className="text-red-500 text-xs italic">{errors.paymentType.message}</p>}
        </div>

        {/* CATEGORY */}
        <div className="w-full flex-1 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="category">
            Category
          </label>
          <select
            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="category"
            disabled={loading}
            {...register("category", { required: "Please select a category" })}
          >
            <option value="saving">Saving</option>
            <option value="expense">Expense</option>
            <option value="investment">Investment</option>
            <option value="income">Income</option>
            <option value="entertainment">Entertainment</option>
            <option value="education">Education</option>
            <option value="travel">Travel</option>
            <option value="bills">Bills</option>
          </select>
          {errors.category && <p className="text-red-500 text-xs italic">{errors.category.message}</p>}
        </div>
      </div>

      {/* AMOUNT */}
      <div className="w-full flex-1 mb-6 md:mb-0">
        <label className="block uppercase text-white text-xs font-bold mb-2" htmlFor="amount">
          Amount(₹)
        </label>
        <input
          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          id="amount"
          type="number"
          placeholder="15000"
          disabled={loading}
          {...register("amount", {
            required: "Amount must be greater than zero",
            valueAsNumber: true,
            validate: (value) => value > 0 || "Amount must be greater than zero",
          })}
        />
        {errors.amount && <p className="text-red-500 text-xs italic">{errors.amount.message}</p>}
      </div>

      {/* LOCATION */}
      <div className="w-full flex-1 mb-6 md:mb-0">
        <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="location">
          Location
        </label>
        <input
          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
          id="location"
          type="text"
          placeholder="New York"
          disabled={loading}
          {...register("location", { required: "Location is required" })}
        />
        {errors.location && <p className="text-red-500 text-xs italic">{errors.location.message}</p>}
      </div>

      {/* DATE */}
      <div className="w-full flex-1 mb-6 md:mb-0">
        <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="date">
          Date
        </label>
        <input
          type="date"
          id="date"
          className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
          placeholder="Select date"
          disabled={loading}
          {...register("date", { required: "Date is required" })}
        />
        {errors.date && <p className="text-red-500 text-xs italic">{errors.date.message}</p>}
      </div>

      {/* SUBMIT BUTTON */}
      <button
        className="text-white font-bold w-full rounded px-4 py-2 bg-gradient-to-br from-pink-500 to-pink-500 hover:from-pink-600 hover:to-pink-600 disabled:opacity-70 disabled:cursor-not-allowed"
        type="submit"
        disabled={loading}
      >
        {loading ? "Loading..." : "Add Transaction"}
      </button>
    </form>
  );
};

export default TransactionForm;
