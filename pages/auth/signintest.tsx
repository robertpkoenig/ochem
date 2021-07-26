import { getAuth, Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, browserLocalPersistence } from "firebase/auth";
import firebaseClient from "../../firebaseClient";


export default function Test() {
    
    const auth = getAuth();
    auth.setPersistence(browserLocalPersistence)

    createUserWithEmailAndPassword(auth, "turier@turier.com", "test1234")
        .then(result => {
            console.log(result.user);
        })
        .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
            alert('The password is too weak.');
        } else {
            alert(errorMessage);
        }
        console.log(error);
        })

    return (
        <div>
            This is the test auth page
        </div>
    )

}