import * as React from "react";
import {Routes, Route} from "react-router-dom";
import LogInPage from "./pages/login";
import {PageNotFound} from "./pages/no-match";
import SignUpPage from "./pages/signup";
import {HomePage} from "./pages/home";
import {UserAuthProvider} from "./lib/context/userContext";
import {RequireAuth} from "./lib/requied-auth";
import Layout from "./components/layout";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BackgroundSVG from "./components/background-svg";


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
                        <RequireAuth>
                            <Layout/>
                        </RequireAuth>
                    }>
                        <Route path="/" element={<HomePage/>}/>
                    </Route>
                    <Route path="login" element={<LogInPage/>}/>
                    <Route path='signup' element={<SignUpPage/>}/>
                    <Route path="*" element={<PageNotFound/>}/>
                </Routes>
            <ToastContainer position="bottom-right"
                            autoClose={5000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover />

        </UserAuthProvider>
    );
}
