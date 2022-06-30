import axios from "axios";
import {BASEURL} from "../lib/constants/constants";

export const headerConfig = (authToken) => {
    return {
        headers: {Authorization: `Bearer ${authToken}`}
    }
}

export const getBikes = ({authToken, body}) =>
    axios.post(`${BASEURL}/bike`, body, headerConfig(authToken),).then(response => response.data)

export const bookABike = (body, authtoken) =>
    axios.post(`${BASEURL}/reservation/book`, body, headerConfig(authtoken)).then(response => response.data)

export const getReservations = ({page = 1, bikeId, userId}, token) =>
    axios.get(`${BASEURL}/reservation?page=${page}`, {
        headers: {Authorization: `Bearer ${token}`},
        params: {bikeId, userId}
    }).then(response => response.data)

export const cancelReservation = (id, token) =>
    axios.put(`${BASEURL}/reservation/${id}/cancel`,{}, headerConfig(token)).then(response => response.data)


export const addRating = ({ id, rate }, token) =>
    axios.post(`${BASEURL}/reservation/rate`, { id, rate },headerConfig(token)).then(response => response.data)