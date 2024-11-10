

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import Cards from "../components/Cards";
import TransactionForm from "../components/TransactionForm";

import { MdLogout } from "react-icons/md";
import {useMutation, useQuery} from "@apollo/client";
import {LOGOUT} from "../graphql/mutations/user.mutation.js";
import toast from "react-hot-toast";
import {GET_AUTHENTICATE_USER} from "../graphql/queries/user.query.js";
import {GET_TRANSACTION_STATISTICS} from "../graphql/queries/transaction.query.js"
import { useEffect } from "react";
ChartJS.register(ArcElement, Tooltip, Legend);



ChartJS.register(ArcElement, Tooltip, Legend);

const HomePage = () => {

    const {data}=useQuery(GET_TRANSACTION_STATISTICS);
    const {data:authUserData}=useQuery(GET_AUTHENTICATE_USER)



    



    const [logout,{loading,client}] = useMutation(LOGOUT,{
        refetchQueries:["GetAuthenticatedUser"]
    })


  useEffect(()=>{
      if(data?.categoryStatistics){
        
      }
  })


    const handleLogout = async () => {
    try{
        await  logout();
        // Clear the Apollo Client cache FROM THE DOCS
        // https://www.apollographql.com/docs/react/caching/advanced-topics/#:~:text=Resetting%20the%20cache,any%20of%20your%20active%20queries
        client.resetStore()
    }catch (error){
        console.error("Error logging out:", error);
        toast.error(error.message);

    }
    };


    return (
        <>
            <div className='flex flex-col gap-6 items-center max-w-7xl mx-auto z-20 relative justify-center'>
                <div className='flex items-center'>
                    <p className='md:text-4xl text-2xl lg:text-4xl font-bold text-center relative z-50 mb-4 mr-4 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text'>
                        Spend wisely, track wisely
                    </p>
                    <img
                        src={authUserData?.authUser.profilePicture}
                        className='w-11 h-11 rounded-full border cursor-pointer'
                        alt='Avatar'
                    />
                    {!loading && <MdLogout className='mx-2 w-5 h-5 cursor-pointer' onClick={handleLogout} />}
                    {/* loading spinner */}
                    {loading && <div className='w-6 h-6 border-t-2 border-b-2 mx-2 rounded-full animate-spin'></div>}
                </div>
                <div className='flex flex-wrap w-full justify-center items-center gap-6'>
                    <div className='h-[330px] w-[330px] md:h-[360px] md:w-[360px]  '>
                        <Doughnut data={chartData} />
                    </div>

                    <TransactionForm />
                </div>
                <Cards />
            </div>
        </>
    );
};
export default HomePage;