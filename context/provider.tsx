import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import firebaseClient from "../firebaseClient";
import nookies from "nookies"
import router, { useRouter } from "next/router";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import FirebaseNames from "../model/FirebaseConstants";
import User from "../model/User";

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
    const db = getFirestore()

    const router = useRouter()

    useEffect(() => {

        const auth = getAuth();

        if (!user) {
            onAuthStateChanged(auth, (loggedInUser) => {
                
                if (!loggedInUser) {            
                    if (router.pathname != "/") {
                        router.push("/")
                    }
                }

                const docRef = doc(db, FirebaseNames.USERS, loggedInUser.uid);
                getDoc(docRef).then(docSnap => {
                    const dbUser = docSnap.data()
                    setUser(dbUser as User)
                });

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