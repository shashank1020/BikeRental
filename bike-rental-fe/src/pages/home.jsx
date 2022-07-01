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
import AddUpdateBike from "../components/atoms/add-update-bike";

const initBike = {
    model: '',
    color: '',
    location: '',
    isAvailable: true
}

const HomePage = () => {
    const [bikes, setBikes] = useState([])
    const [form, setForm] = useState()
    const [refreshPage, setRefreshPage] = useState(false)
    const {user, authToken, setUser, setAuthToken} = useUserAuthContext()
    const [addUpdateBikeData, setAddUpdateBikeData] = useState({...initBike, isUpdate: false, openModal: false})
    const handleGetBike = (body) => {
        getBikes({authToken, body}).then(data => {
            setBikes(data)
            setRefreshPage(false)
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
    }, [form, refreshPage])

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
                    <PrimaryButton variant='contained' className='add-bike'
                                   onClick={() => setAddUpdateBikeData({...addUpdateBikeData, openModal: true})}>Add
                        Bike</PrimaryButton>}
            </div>
            {/* Add bikes */}
            {addUpdateBikeData.openModal &&
                <AddUpdateBike openModal={addUpdateBikeData.openModal} setOpenModal={setAddUpdateBikeData}
                               bikeObj={initBike} setRefreshPage={setRefreshPage}/>}
            {/* Update bikes */}
            {addUpdateBikeData.isUpdate &&
                <AddUpdateBike isUpdate={addUpdateBikeData.isUpdate} openModal={addUpdateBikeData.openModal}
                               setOpenModal={setAddUpdateBikeData} bikeObj={addUpdateBikeData}
                               setRefreshPage={setRefreshPage}/>}
            {bikes && bikes?.bikes &&
                <AllBikes bikeList={bikes} handelBooking={handelBooking} setForm={setForm}
                          setRefreshPage={setRefreshPage} setUpdateBikeData={setAddUpdateBikeData}/>}
        </div>
    )
}

export default HomePage;