import axios from "axios";
import {BASEURL} from "../lib/constants/constants";



export const loginUser = ({username, password}) =>
    axios.post(`${BASEURL}/auth/login`,{username, password}).then(response => response.data)

export const signUp = ({username, password, role}) =>
    axios.post(`${BASEURL}/auth/signup`, {username, password, role}).then(response => response.data)