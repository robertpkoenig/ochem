import { getAuth } from "firebase/auth"

export default function SignOut() {

    function signOut() {
        getAuth().signOut()
    }

    return (
        <button onClick={() => signOut()}>
            hello
        </button>
    )

}