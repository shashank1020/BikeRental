import * as React from "react";
import {Route, Routes} from "react-router-dom";
import {ManagerRoute, ProtectRoute} from "./lib/requied-auth";
// pages
import LogInPage from "./pages/login";
import PageNotFoundPage from "./pages/no-match";
import SignUpPage from "./pages/signup";
import HomePage from "./pages/home";
import UsersPage from "./pages/users";
import ReservationPage from "./pages/reservation";
import AllMyBikesPage from "./pages/all-my-bikes-page";
// context
import {UserAuthProvider} from "./lib/context/userContext";
// Layout
import NavBar from "./components/NavBar";
// notifications
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function App() {
    const token = JSON.parse(localStorage.getItem('token'))
    const [user, setUser] = React.useState(token?._user || null);
    const [authToken, setAuthToken] = React.useState(token?._authToken || null)

    const contextValue = {
        user,
        setUser,
        authToken,
        setAuthToken,
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
                    <Route path="/allmybikes" element={
                        <ManagerRoute>
                            <AllMyBikesPage/>
                        </ManagerRoute>
                    }/>
                    <Route path="/reservation" element={<ReservationPage/>}/>
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
