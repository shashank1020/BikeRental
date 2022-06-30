import {toast} from "react-toastify";

export const logout = (setUser, setAuthToken) => {
    setUser(null)
    setAuthToken(null)
    localStorage.removeItem('token')
    toast.error('Session Expired')
}

export const error400 = (e) => toast.warning(e?.response?.data?.message.toString().replace('\\', ''))
export const error401 = (e) => toast.error(e.message || e?.response?.data?.message.error)