import React, {useState} from "react";
import SearchBar from "../components/search-bar";
import AllBikes from "../components/all-bikes";

export const HomePage = () => {
    const [bikes, setBikes] = useState([])
    console.log(bikes)
    return (
        <>
            <SearchBar setBikes={setBikes}/>
            {bikes && bikes.length > 0 && <AllBikes bikeList={bikes}/>}
        </>
    )
}