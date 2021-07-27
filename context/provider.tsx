import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import firebaseClient from "../firebaseClient";
import nookies from "nookies"
import router, { useRouter } from "next/router";

type authContextType = {
    user: User
}

const authContextDefaultValues: authContextType = {
    user: null
}

export const AuthContext = createContext<authContextType>(authContextDefaultValues);

export function useAuth() {
    return useContext(AuthContext)
}

type Props = {
    children: ReactNode;
}

export function AuthProvider({ children }: Props) {
    const [user, setUser] = useState<User | null>(null);

    firebaseClient()

    const router = useRouter()

    useEffect(() => {

        const auth = getAuth();
    
        if (!user) {
            onAuthStateChanged(auth, (loggedInUser) => {
                setUser(loggedInUser)

                if (!loggedInUser) {            
                    if (router.pathname != "/") {
                        router.push('/')
                    }
                }

           })
        }

    })

    const authContext = {
        user
    }

    return (
        <>
            <AuthContext.Provider value={authContext}>
                {children}
            </AuthContext.Provider>
        </>
    )
}