import {Navigate, useLocation} from "react-router-dom";
// context
import {useUserAuthContext} from "../lib/context/userContext";

const UsersPage = () => {
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

export default UsersPage;