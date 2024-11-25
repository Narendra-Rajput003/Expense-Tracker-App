import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_TRANSACTION } from "../graphql/mutations/transaction.mutation";
import { GET_TRANSACTION,GET_TRANSACTION_STATISTICS } from "../graphql/queries/transaction.query";
import toast from "react-hot-toast";

const TransactionPage = () => {
  const { id } = useParams();
  const { data, loading, error } = useQuery(GET_TRANSACTION, {
    variables: { id },
  });

  console.log("updaform",data)

  const [updateTransaction, { loading: loadingUpdate }] = useMutation(UPDATE_TRANSACTION, {
    refetchQueries: [{ query: GET_TRANSACTION_STATISTICS }],
  });

  const [formData, setFormData] = useState({
    description:data?.transaction?.description ||  "",
    paymentType:data?.transaction?.paymentType || "",
    category:data?.transaction?.category || "",
    amount:data?.transaction?.amount || "",
    location:data?.transaction?.location || "",
    date:data?.transaction?.date || "",
  });

  useEffect(() => {
    if (data) {
      setFormData({
        description: data.transaction.description ,
        paymentType: data.transaction.paymentType ,
        category: data.transaction.category ,
        amount: data.transaction.amount ,
        location: data.transaction.location ,
        date: new Date(+data.transaction.date).toISOString().substr(0, 10),
      });
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTransaction({
        variables: {
          input: { ...formData, amount: parseFloat(formData.amount), transactionId: id },
        },
      });
      toast.success("Transaction updated successfully");
    } catch (error) {
      
      toast.error(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };


  



  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading transaction data.</p>;

  return (
    <div className="h-screen max-w-4xl mx-auto flex flex-col items-center">
      <h2 className="md:text-4xl text-2xl lg:text-4xl font-bold text-center mb-6 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 text-transparent bg-clip-text">
        Update Transaction
      </h2>
      <form onSubmit={handleSubmit} className="w-full max-w-lg flex flex-col gap-5 px-3">
        <InputField
          label="Transaction"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Rent, Groceries, Salary, etc."
        />
        <SelectField
          label="Payment Type"
          name="paymentType"
          options={["CreditCard", "DebitCard", "NetBanking", "GooglePay", "Paytm"]}
          value={formData.paymentType}
          onChange={handleInputChange}
        />
        <SelectField
          label="Category"
          name="category"
          options={["saving", "expense", "investment", "income", "entertainment", "education", "travel", "bills"]}
          value={formData.category}
          onChange={handleInputChange}
        />
        <InputField
          label="Amount (₹)"
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleInputChange}
          placeholder="150"
        />
        <InputField
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          placeholder="New York"
        />
        <InputField
          label="Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="text-white font-bold w-full rounded px-4 py-2 bg-gradient-to-br from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
          disabled={loadingUpdate}
        >
          {loadingUpdate ? "Updating..." : "Update Transaction"}
        </button>
      </form>
    </div>
  );
};

// Reusable Input Field Component
const InputField = ({ label, name, type = "text", value, onChange, placeholder }) => (
  <div className="flex flex-col">
    <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
    />
  </div>
);

// Reusable Select Field Component
const SelectField = ({ label, name, options, value, onChange }) => (
  <div className="flex flex-col">
    <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </option>
      ))}
    </select>
  </div>
);

export default TransactionPage;
