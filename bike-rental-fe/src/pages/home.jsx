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
import {UserRole} from "../lib/constants/constants";
import {PrimaryButton} from "../styles";
import AddBike from "../components/atoms/add-bike";

const initBike = {
    model: '',
    color: '',
    location: '',
    isAvailable: true
}

const HomePage = () => {s
    const [bikes, setBikes] = useState([])
    const [addBike, setAddBike] = useState(false)
    const [form, setForm] = useState()
    const {user, authToken, setUser, setAuthToken} = useUserAuthContext()

    const handleGetBike = (body) => {
        getBikes({authToken, body}).then(data => {
            setBikes(data)
        }).catch((e) => {
            if (e?.response?.data?.statusCode === 401) {
                logout(setUser, setAuthToken)
            } else {
                if (e.response.data.statusCode === 400)
                    if (e.response.data.error.toString().includes('must be larger than or equal to'))
                        toast.warning('from Date must be less then to Date')

            }
        })
    }

    useEffect(() => {
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
            <SearchBar setForm={setForm}/>
            <div>
                {user.role === UserRole.MANAGER &&
                    <PrimaryButton variant='contained' className='add-bike' onClick={() => setAddBike(true)}>Add
                        Bike</PrimaryButton>}
            </div>
                {addBike && <AddBike addBike={addBike} setAddBike={setAddBike} bikeObj={initBike}/>}
            {bikes && bikes?.bikes &&
                <AllBikes bikeList={bikes} handelBooking={handelBooking} form={form} setForm={setForm}/>}
        </div>
    )
}

export default HomePage;