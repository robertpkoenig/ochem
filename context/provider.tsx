import { getAuth, User } from "firebase/auth";
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import firebaseClient from "../firebaseClient";
import nookies from "nookies"

type authContextType = {
    user: User
};

const authContextDefaultValues: authContextType = {
    user: null
};

const AuthContext = createContext<authContextType>(authContextDefaultValues);

export function useAuth() {
    return useContext(AuthContext);
}

type Props = {
    children: ReactNode;
};

export function AuthProvider({ children }: Props) {
    const [user, setUser] = useState<User | null>(null);

    firebaseClient()
    const auth = getAuth();

    useEffect(() => {
        return auth.onIdTokenChanged(async (oldUser) => {
            if (!oldUser) {
                setUser(null)
                nookies.set(undefined, "token", "", {})
            }
            else {
                const token = await oldUser.getIdToken()
                setUser(oldUser)
                nookies.set(undefined, "token", token, {})
            }
        })
    }, [])

    console.log("user within the provider", user);
    

    const value = {
        user
    };

    return (
        <>
            <AuthContext.Provider value={value}>
                {children}
            </AuthContext.Provider>
        </>
    )
}