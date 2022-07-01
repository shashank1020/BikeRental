import React, {useState} from "react";
import {Route, Routes} from "react-router-dom";
import {ManagerRoute, ProtectRoute} from "./lib/protectedRoutes";
// pages
import LogInPage from "./pages/login";
import PageNotFoundPage from "./pages/no-match";
import SignUpPage from "./pages/signup";
import HomePage from "./pages/home";
import UsersPage from "./pages/users";
import ReservationPage from "./pages/reservation";
// context
import {UserAuthProvider} from "./lib/context/userContext";
// Layout
import NavBar from "./components/NavBar";
// notifications
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function App() {
    const token = JSON.parse(localStorage.getItem('token'))
    const [user, setUser] = useState(token?._user || null);
    const [authToken, setAuthToken] = useState(token?._authToken || null)

    const contextValue = {
        user,
        setUser,
        authToken,
        setAuthToken
    }

    return (
        <UserAuthProvider value={contextValue}>
            <Routes>
                {/* Protected routes */}
                <Route path="/" element={
                    <ProtectRoute>
                        <NavBar/>
                    </ProtectRoute>
                }>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/users" element={
                        <ManagerRoute>
                            <UsersPage/>
                        </ManagerRoute>
                    }/>
                    <Route path="/reservations" element={<ReservationPage/>}>
                    </Route>
                </Route>
                <Route path="login" element={<LogInPage/>}/>
                <Route path='signup' element={<SignUpPage/>}/>
                <Route path="*" element={<PageNotFoundPage/>}/>
            </Routes>
            <ToastContainer position="bottom-right"
                            autoClose={5000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover/>

        </UserAuthProvider>
    );
}
