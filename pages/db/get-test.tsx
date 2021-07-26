import { doc, getDoc, getFirestore } from "firebase/firestore";
import firebaseClient from "../../firebaseClient";

export default function GetTest() {

    async function getData() {

        firebaseClient()
        const db = getFirestore()

        const docRef = doc(db, "cities", "LA");
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