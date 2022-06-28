import {useUserAuthContext} from "../lib/context/userContext";
import {Navigate, useLocation} from "react-router-dom";

const UserPage = () => {
    const {authToken} = useUserAuthContext()
    let location = useLocation();
    if (!authToken)
        return <Navigate to="/login" state={{from: location}}/>;

    return(
        <>
            user Page
        </>
    )
}

export default UserPage;