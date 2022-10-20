import { setDoc, doc, getFirestore } from "firebase/firestore";
import { REACTIONS } from "../../../../persistence-model/FirebaseConstants";
import Reaction from "../../../model/Reaction";

/** Saves a reaction to Firebase */
class ReactionSaver {

    public static saveReaction(reaction: Reaction) {
        const db = getFirestore()
        setDoc(doc(db, REACTIONS, reaction.uuid), reaction.toJSON());
    }

}

export default ReactionSaver