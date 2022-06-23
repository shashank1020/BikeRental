import axios from "axios";
import {BASEURL} from "../lib/constants/constants";

const headerConfig = (authToken) => {
    return {
        headers: {Authorization: `Bearer ${authToken}`}
    }
}

export const GetBikesManager = (authToken) =>
    axios.get(`${BASEURL}/bike/manager`, headerConfig(authToken)).then(response => response.data)

export const GetBikes = ({authToken, location}) => {
    return axios.post(`${BASEURL}/bike`,{location}, headerConfig(authToken), ).then(response => response.data)}

