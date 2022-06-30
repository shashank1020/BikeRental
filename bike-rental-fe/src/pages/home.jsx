import React, {useEffect, useState} from "react";
// component
import SearchBar from "../components/search-bar";
import AllBikes from "../components/all-bikes";
// services
import {bookABike, getBikes} from "../services/bike.service";
// notification
import {toast} from "react-toastify";
// context
import {useUserAuthContext} from "../lib/context/userContext";
import {logout} from "../lib/common";

const HomePage = () => {
    const [bikes, setBikes] = useState([])
    const [form, setForm] = useState()
    const {authToken, setUser, setAuthToken} = useUserAuthContext()

    const handleGetBike = (body) => {
        getBikes({authToken, body}).then(data => {
            console.log(data)
            setBikes(data)
        }).catch((e) => {
            if (e?.response?.data?.statusCode === 401) {
                logout(setUser, setAuthToken)
            } else {
                if(e.response.data.statusCode === 400)
                    if (e.response.data.error.toString().includes('must be larger than or equal to'))
                        toast.warning('from Date must be less then to Date')

            }
        })
    }

    useEffect(()=>{
        handleGetBike(form)
    }, [form])

    const handelBooking = (bikeId) => {
        const body = {
            bikeId,
            fromDate: form.fromDate,
            toDate: form.toDate
        }
        return bookABike(body, authToken)
    }
    return (
        <div className="max-screen-size">
            <SearchBar setForm={setForm} />
            {bikes && bikes?.bikes && <AllBikes bikeList={bikes} handelBooking={handelBooking} form={form} setForm={setForm} />}
        </div>
    )
}

export default HomePage;