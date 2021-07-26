import { getAuth, Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, browserLocalPersistence } from "firebase/auth";
import Link from "next/link";

export default function LoginTest() {
    
    function login() {
        const auth = getAuth();
        auth.setPersistence(browserLocalPersistence)

        signInWithEmailAndPassword(auth, "turier@turier.com", "test1234")
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
    }

    return (
        <div>
            <button onClick={() => login()}>
                Hello
            </button>
        </div>
    )

}