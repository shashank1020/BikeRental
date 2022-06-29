import axios from "axios";
import {BASEURL} from "../lib/constants/constants";

export const headerConfig = (authToken) => {
    return {
        headers: {Authorization: `Bearer ${authToken}`}
    }
}

export const GetBikesManager = (authToken) =>
    axios.get(`${BASEURL}/bike/manager`, headerConfig(authToken)).then(response => response.data)

export const GetBikes = ({authToken, body}) =>
    axios.post(`${BASEURL}/bike`,body, headerConfig(authToken), ).then(response => response.data)

export const BookABike = (body, authtoken) =>
    axios.post(`${BASEURL}/reservation/book`, body, headerConfig(authtoken)).then(response => response.data)