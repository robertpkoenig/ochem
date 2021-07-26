import { database } from "firebase-admin"

const admin = require("firebase-admin")
const serviceAccount = require("./secrets.json")

export const verifyIdToken = (token) => {
    if(!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://ochem-bc739-default-rtdb.europe-west1.firebasedatabase.app/" 
        })
    }

    return admin
        .auth()
        .verifyIdToken(token)
        .catch((error) => {
            throw error
        })
}