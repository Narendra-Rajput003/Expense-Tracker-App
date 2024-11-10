import Header from "./components/ui/Header.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import TransactionPage from "./pages/TransactionPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import NotFound from "./pages/NotFoundPage.jsx";
import {Routes, Route, Navigate} from "react-router-dom";
import {Toaster} from "react-hot-toast";
import {useQuery} from "@apollo/client";
import {GET_AUTHENTICATE_USER} from "./graphql/queries/user.query.js";


function App() {

    const {loading,data}=useQuery(GET_AUTHENTICATE_USER)

    if (loading) return null;
    console.log("Data",data.authUser)

    return (
        <>
            {data?.authUser && <Header/>}
            <Routes>
                <Route path='/' element={data.authUser ?<HomePage /> :<Navigate to="/login"/>} />
                <Route path='/login' element={!data.authUser ?<LoginPage />:<Navigate to="/"/>} />
                <Route path='/signup' element={!data.authUser ? <SignUpPage />:<Navigate to="/"/>} />
                <Route path='/transaction/:id' element={data.authUser?<TransactionPage />:<Navigate to="/login"/>} />
                <Route path='*' element={<NotFound />} />
            </Routes>
            <Toaster/>
        </>
    );
}
export default App;