import React, {useEffect, useState} from "react";
import SearchBar from "../components/search-bar";
import AllBikes from "../components/all-bikes";
import {BookABike, GetBikes} from "../services/bike.service";
import {toast} from "react-toastify";
import {useUserAuthContext} from "../lib/context/userContext";

export const HomePage = () => {
    const [bikes, setBikes] = useState([])
    const [form, setForm] = useState()
    const {authToken, setUser, setAuthToken} = useUserAuthContext()

    const handleGetBike = (body) => {
        GetBikes({authToken, body}).then(data => {
            console.log(data)
            setBikes(data)
        }).catch((e) => {
            if (e.response.status === 401) {
                setUser(null)
                setAuthToken(null)
                localStorage.removeItem('token')
                toast.error('Session Expired')
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
        return BookABike(body, authToken)
    }
    return (
        <>
            <SearchBar setForm={setForm} />
            {bikes && bikes?.bikes && <AllBikes bikeList={bikes} handelBooking={handelBooking} form={form} setForm={setForm} />}
        </>
    )
}