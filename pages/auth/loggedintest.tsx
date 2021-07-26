import { browserLocalPersistence, getAuth, setPersistence, signInWithEmailAndPassword } from "firebase/auth";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/provider";
import nookies from "nookies"
import { verifyIdToken } from '../../firebaseAdmin'
import { auth } from "firebase-admin";
import { useRouter } from 'next/router';

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const cookies = nookies.get(context)
        const token = await verifyIdToken(cookies.token)
        return {
            props: {
                token: token
            }
        }
    }
    catch(error) {
        return  {
                redirect: {
                destination: '/',
                permanent: false,
                }
        }
    }
}

interface IProps {
    token: auth.DecodedIdToken
}

export default function Test(props: IProps) {

    // const { user } = useAuth()

//    const user = useAuth()

//    console.log(user);
   
    // const [user, setUser] = useState(null)

    // useEffect(() => {
    //     const firebase = firebaseClient
    //     const auth = getAuth();
    //     auth.onAuthStateChanged(user => {
    //         setUser(user.email)
    //     })
        // setPersistence(auth, browserLocalPersistence)
        //     .then(() => {
        //         // Existing and future Auth states are now persisted in the current
        //         // session only. Closing the window would clear any existing state even
        //         // if a user forgets to sign out.
        //         // ...
        //         // New sign-in will be persisted with session persistence.
        //         signInWithEmailAndPassword(auth, "turier@turier.com", "test1234").then(
        //             userCredential => {
        //                 setUser(userCredential.user.email)
        //             }
        //         )
        //     })
        //     .catch((error) => {
        //     // Handle Errors here.
        //     const errorCode = error.code;
        //     const errorMessage = error.message;
        // })
        // console.log("user after login", auth.currentUser);
        // if (!auth.currentUser) {
        //     signInWithEmailAndPassword(auth, "turier@turier.com", "test1234").then(result => {
        //         console.log(result.user);
        //     }) 
        // }
    // })

    return (
        <div>
            {props.token ? props.token.email : "nothing"}
        </div>
    )

}