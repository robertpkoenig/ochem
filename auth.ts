import React, {useState, useEffect, useContext, createContext, ReactNode}
from "react"

import { onIdTokenChanged } from "@firebase/auth"
import { getAuth, User } from "firebase/auth";
import nookies from "nookies"
import firebaseClient from "./firebaseClient"

type authContextType = {
    user: User
};

const authContextDefaultValues: authContextType = {
    user: null
};

const AuthContext = createContext<authContextType>(authContextDefaultValues);

type Props = {
    children: ReactNode;
};

// export function AuthProvider({children}: Props) {
//     firebaseClient()
//     const [user, setUser] = useState<User | null>(null)
//     const auth = getAuth()

//     useEffect(() => {
//         return auth.onIdTokenChanged(async (oldUser) => {
//             if (!oldUser) {
//                 setUser(null)
//                 nookies.set(undefined, "token", "", {})
//             }
//             else {
//                 const token = await oldUser.getIdToken()
//                 setUser(oldUser)
//                 nookies.set(undefined, "token", token, {})
//             }
//         })
//     }, [])

//     const value = {
//         user
//     };

//     return (
//         <>
//             <AuthContext.Provider value={value}>
//                 {children}
//             </AuthContext.Provider>
//         </>
        
//     )

// }

export const useAuth = () => useContext(AuthContext)