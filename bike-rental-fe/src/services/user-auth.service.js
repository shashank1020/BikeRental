import axios from "axios";
import {BASEURL} from "../lib/constants/constants";
import {headerConfig} from "./bike.service";


export const loginUser = ({email, password}) =>
    axios.post(`${BASEURL}/user/login`, {email, password}).then(response => response.data)

export const signUp = ({email, password, role}) =>
    axios.post(`${BASEURL}/user/signup`, {email, password, role}).then(response => response.data)

export const updateUser = ({id, email, role}, token) =>
    axios.put(`${BASEURL}/user/${id}`, {email, role}, headerConfig(token)).then(response => response.data)

export const addUser = ({email, password, role, addRoleByManager = true}, token) =>
    axios.post(`${BASEURL}/user/add`, {
        email,
        password,
        role,
        addRoleByManager
    }, headerConfig(token)).then(response => response.data)

export const getUsers = (page, token) =>
    axios.get(`${BASEURL}/user/?page=${page}`, headerConfig(token)).then(response => response.data)

export const deleteUser = (id, token) =>
    axios.delete(`${BASEURL}/user/${id}`, headerConfig(token)).then(response => response.data)