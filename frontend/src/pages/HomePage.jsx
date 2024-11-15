import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import Cards from "../components/Cards";
import TransactionForm from "../components/TransactionForm";

import { MdLogout } from "react-icons/md";
import { useMutation, useQuery } from "@apollo/client";
import { LOGOUT } from "../graphql/mutations/user.mutation.js";
import toast from "react-hot-toast";
import { GET_AUTHENTICATE_USER } from "../graphql/queries/user.query.js";
import { GET_TRANSACTION_STATISTICS } from "../graphql/mutations/transaction.mutation.js";
import { useEffect } from "react";
ChartJS.register(ArcElement, Tooltip, Legend);

ChartJS.register(ArcElement, Tooltip, Legend);

const HomePage = () => {
  const {
    data,
    error,
    loading: statsLoading,
  } = useQuery(GET_TRANSACTION_STATISTICS);

  const { data: authUserData } = useQuery(GET_AUTHENTICATE_USER);

  console.log("Data of statics", data);

  const [logout, { loading, client }] = useMutation(LOGOUT, {
    refetchQueries: ["GetAuthenticatedUser"],
  });

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "$",
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
        borderRadius: 30,
        spacing: 10,
        cutout: 130,
      },
    ],
  });

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

useEffect(() => {
    if (data?.categoryStatistics) {
        const categories = data.categoryStatistics.map((stat) => stat.category);
        const totalAmounts = data.categoryStatistics.map((stat) => stat.totalAmount);

        const backgroundColors = [];
        const borderColors = [];

        categories.forEach((category) => {
            const color = categoryColorMap[category] || "from-gray-600 to-gray-400"; // Default gradient
            backgroundColors.push(`linear-gradient(to right, ${color.replace("from-", "").replace("to-", "").split(" to ").join(", ")})`);
            borderColors.push(color.split(" to ")[1]); // Use the end color for border
        });

        setChartData((prev) => ({
            labels: categories,
            datasets: [
                {
                    ...prev.datasets[0],
                    data: totalAmounts,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                },
            ],
        }));
    }
}, [data]);


  if (statsLoading) {
    return <div>Loading transaction statistics...</div>;
  }
  if (error) {
    console.error("Error fetching transaction statistics:", error);
    return <div>Error loading statistics</div>;
  }

  const handleLogout = async () => {
    try {
      await logout();
      // Clear the Apollo Client cache FROM THE DOCS
      // https://www.apollographql.com/docs/react/caching/advanced-topics/#:~:text=Resetting%20the%20cache,any%20of%20your%20active%20queries
      client.resetStore();
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6 items-center max-w-7xl mx-auto z-20 relative justify-center">
        <div className="flex items-center">
          <p className="md:text-4xl text-2xl lg:text-4xl font-bold text-center relative z-50 mb-4 mr-4 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text">
            Spend wisely, track wisely
          </p>
          <img
            src={authUserData?.authUser.profilePicture}
            className="w-11 h-11 rounded-full border cursor-pointer"
            alt="Avatar"
          />
          {!loading && (
            <MdLogout
              className="mx-2 w-5 h-5 cursor-pointer"
              onClick={handleLogout}
            />
          )}
          {/* loading spinner */}
          {loading && (
            <div className="w-6 h-6 border-t-2 border-b-2 mx-2 rounded-full animate-spin"></div>
          )}
        </div>
        <div className="flex flex-wrap w-full justify-center items-center gap-6">
          {data?.categoryStatistics.length > 0 && (
            <div>
              <div className="h-[330px] w-[330px] md:h-[360px] md:w-[360px]  ">
                <Doughnut data={chartData} />
              </div>
            </div>
          )}

          <TransactionForm />
        </div>
        <Cards />
      </div>
    </>
  );
};
export default HomePage;
