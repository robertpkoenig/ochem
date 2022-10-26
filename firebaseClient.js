import { initializeApp, getApps } from "firebase/app";
import * as firebase from "firebase/app";

// TODO: Replace the following with your app's Firebase project configuration
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBUlNGLDpnHFqV-OVmajNjDL1sZ-rENPzA",
  authDomain: "ochem-bc739.firebaseapp.com",
  projectId: "ochem-bc739",
  storageBucket: "ochem-bc739.appspot.com",
  messagingSenderId: "516835101613",
  appId: "1:516835101613:web:74cb82a0f811cd1f09af24",
};

export default function firebaseClient() {
  if (!getApps().length) {
    firebase.initializeApp(FIREBASE_CONFIG);
  }
}
