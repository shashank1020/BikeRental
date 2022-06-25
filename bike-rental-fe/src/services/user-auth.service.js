import axios from "axios";
import {BASEURL} from "../lib/constants/constants";



export const loginUser = ({email, password}) =>
    axios.post(`${BASEURL}/auth/login`,{email, password}).then(response => response.data)

export const signUp = ({email, password, role}) =>
    axios.post(`${BASEURL}/auth/signup`, {email, password, role}).then(response => response.data)