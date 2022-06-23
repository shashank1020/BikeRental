import {Navigate, useLocation} from "react-router-dom";
import {useUserAuthContext} from "./context/userContext";

export function RequireAuth({children}) {
    const {authToken} = useUserAuthContext()
    let location = useLocation();

    if (!authToken) {
        return <Navigate to="/login" state={{from: location}}/>;
    }

    return children;
}
