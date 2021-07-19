import Reaction from "../../model/Reaction";

class ReactionSaver {

    public static saveReaction(reaction: Reaction) {
        localStorage.setItem(reaction.uuid, JSON.stringify(reaction))
        console.log("saved");
        console.log(JSON.stringify(reaction));
        
    }

}

export default ReactionSaver