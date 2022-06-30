import {Navigate, useLocation} from "react-router-dom";
import {useUserAuthContext} from "./context/userContext";
import {UserRole} from "./constants/constants";

export function ProtectRoute({children}) {
    const {authToken} = useUserAuthContext()
    let location = useLocation();

    if (!authToken) {
        return <Navigate to="/login" state={{from: location}}/>;
    }

    return children;
}

export function ManagerRoute({children}) {
    const {authToken, user} = useUserAuthContext()
    let location = useLocation();

    if (!authToken || user.role === UserRole.REGULAR) {
        return <Navigate to="/" state={{from: location}}/>;
    }

    return children;
}