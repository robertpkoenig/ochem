import { arrayUnion, doc, getFirestore, updateDoc } from "firebase/firestore";
import FirebaseConstants from "../../model/FirebaseConstants";

export default function AnalyticsTest() {

    function createAnalyticsEntry(studentId: string) {
        const date = new Date()
        date.setHours(0)
        date.setMinutes(0)
        date.setSeconds(0)
        date.setMilliseconds(0)

        const dateString = date.toISOString().substring(0, 10)

        const dateQueryString = "dates." + dateString

        let query: any = {}

        query[dateQueryString] = arrayUnion(studentId)
        
        const db = getFirestore()
        updateDoc(doc(db, FirebaseConstants.MODULE_ANALYTICS_RECORDS, "8d01fffe-3497-4af0-915b-a9f03d05a9c7"), query)
    }

    return (

        <button onClick={() => createAnalyticsEntry("studentIdThree")}>
            create analytics record
        </button>

    )

}