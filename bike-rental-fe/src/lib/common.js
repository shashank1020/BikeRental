import {toast} from "react-toastify";

export const logout = (setUser, setAuthToken) => {
    setUser(null)
    setAuthToken(null)
    localStorage.removeItem('token')
    toast.error('Session Expired')
}

export const error400 = (e) => toast.warning(e?.response?.data?.message.toString().replace('\\', ''))

export const validate = (initForm, formItem, ignore = []) => {
    for (let item in initForm) {
        if (ignore && ignore.length > 0 && ignore.includes(item)) continue;
        if (initForm[item] === formItem[item]) {
            toast.warning(`please select ${item}`)
            return false;
        }
    }
    return true
}

export const validateEmail = (email) => {
    const validate = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
    if (!validate) {
        toast.warning('Please enter a correct email')
        return false
    }
    return true
}

export const validatePassword = (pass) => {
    const password = pass.toString()
    const validate = /^(?=.*\d)(?=.*[a-z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,15}$/.test(password)
    if (!validate) {
        toast.warning('password should be least 6 char,have  one special char, one number and one capital')
        return false
    }
    return true
}

export function filterRunner(item, selectedFilter) {
    let points = 0
    let secure = 0
    for (let key in selectedFilter) {
        selectedFilter[key].length > 0 ? points++ : ''
    }
    if (points === 0) return true
    for (let key in selectedFilter) {
        if (selectedFilter[key]?.includes(item[key]))
            secure++
    }
    if (secure === points) return true
    return false
}