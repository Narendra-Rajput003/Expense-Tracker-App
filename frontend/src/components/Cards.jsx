import Card from "./Card";
import { useQuery } from "@apollo/client";
import { GET_TRANSACTIONS } from "../graphql/queries/transaction.query";
import {GET_AUTHENTICATE_USER } from "../graphql/queries/user.query"

const Cards = () => {
  const { data, loading, error } = useQuery(GET_TRANSACTIONS);
  const { data: authUser } = useQuery(GET_AUTHENTICATE_USER );

  if (loading) return (
    <div className="w-full min-h-[40vh] flex items-center justify-center">
      <div className="animate-spin w-12 h-12 border-t-2 border-blue-500 border-4 rounded-full"></div>
    </div>
  );
  
  if (error) return <p className="text-center text-xl font-semibold text-red-500">Error: {error.message}</p>;

  console.log("Cards", data);

  return (
    <div className="w-full px-4 sm:px-10 min-h-[40vh]">
      <p className="text-3xl sm:text-5xl font-bold text-center my-10 text-gray-800">Transaction History</p>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center mb-20">
        {data.transactions.length > 0 ? (
          data.transactions.map((transaction) => (
            <Card key={transaction._id} transaction={transaction} authUser={authUser.authUser}/>
          ))
        ) : (
          <div className="w-full col-span-full flex items-center justify-center">
            <p className="text-center text-2xl font-bold text-gray-500">No transaction history found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cards;
