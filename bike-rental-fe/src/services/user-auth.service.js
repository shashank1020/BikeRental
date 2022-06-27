import axios from "axios";
import {BASEURL} from "../lib/constants/constants";



export const loginUser = ({email, password}) =>
    axios.post(`${BASEURL}/user/login`, {email, password}).then(response => response.data)

export const signUp = ({email, password, role}) =>
    axios.post(`${BASEURL}/user/signup`, {email, password, role}).then(response => response.data)