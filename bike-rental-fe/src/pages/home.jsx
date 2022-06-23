import {useUserAuthContext} from "../lib/context/userContext";
import SearchBar from "../components/search-bar";
import {Bikes} from "../components/bikes";
import React, {useState} from "react";

export const HomePage = () => {
    const {user, authToken} = useUserAuthContext()
    const [bikes, setBikes] = useState([])
    console.log('home console', user, authToken, !!authToken)

    return (
        <>
            <SearchBar setBikes={setBikes}/>
            <Bikes bikeList={bikes}/>
        </>
    )
}