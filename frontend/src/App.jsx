import Header from "./components/ui/Header.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import TransactionPage from "./pages/TransactionPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import NotFound from "./pages/NotFoundPage.jsx";
import {Routes,Route} from "react-router-dom";
function App() {
    const authUser = true;
    return (
        <>
            {authUser && <Header/>}
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/signup' element={<SignUpPage />} />
                <Route path='/transaction/:id' element={<TransactionPage />} />
                <Route path='*' element={<NotFound />} />
            </Routes>
        </>
    );
}
export default App;