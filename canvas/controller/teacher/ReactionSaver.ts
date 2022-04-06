import { setDoc, doc, getFirestore } from "firebase/firestore";
import Reaction from "../../model/Reaction";

class ReactionSaver {

    public static saveReaction(reaction: Reaction) {
        const db = getFirestore()
        // localStorage.setItem(reaction.uuid, JSON.stringify(reaction))
        setDoc(doc(db, "reactions", reaction.uuid), reaction.toJSON());
    }

}

export default ReactionSaver