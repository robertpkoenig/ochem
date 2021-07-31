import { doc, getDoc, getFirestore } from "firebase/firestore";
import firebaseClient from "../../firebaseClient";
import FirebaseConstants from "../../model/FirebaseConstants";

export default function GetTest() {

    async function getData() {

        // firebaseClient()
        const db = getFirestore()

        const docRef = doc(db, FirebaseConstants.MODULE_LISTINGS, "66dbeb59-c83e-496b-8d16-fa4574517611");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        }
    }

    return (

        <button onClick={() => getData()}>
            Get data
        </button>

    )

}