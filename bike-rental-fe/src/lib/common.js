import {toast} from "react-toastify";

export const logout = (setUser, setAuthToken) => {
    setUser(null)
    setAuthToken(null)
    localStorage.removeItem('token')
    toast.error('Session Expired')
}

export const error400 = (e) => toast.warning(e?.response?.data?.message.toString().replace('\\', ''))

export const validate = (initForm, formItem, ignore = []) =>{
    for (let item in initForm) {
        if (ignore && ignore.length>0 && ignore.includes(item)) continue;
        if (initForm[item] === formItem[item]){
            toast.warning(`please select ${item}`)
            return false;
        }
    }
    return true
}