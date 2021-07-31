import { doc, setDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import firebaseClient from "../../firebaseClient";

export default function Test() {

    async function createData() {
        firebaseClient()
        const db = getFirestore()
        // Add a new document in collection "cities"
        await setDoc(doc(db, "cities", "LA"), {
            name: "Los Angeles",
            state: "CA",
            country: "USA"
        });
    }

    return (
        <div>
            <button onClick={() => createData()}>
                Create data
            </button>
        </div>
    )

}