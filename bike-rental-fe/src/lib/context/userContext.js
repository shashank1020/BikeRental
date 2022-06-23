import { createContext, useContext } from 'react'

const UserAuthContext = createContext({
    authToken: null,
    setAuthToken: () => {},
    user: null,
    setUser: () => {},
})

export const UserAuthProvider = UserAuthContext.Provider

export const useUserAuthContext = () => useContext(UserAuthContext) || {}

