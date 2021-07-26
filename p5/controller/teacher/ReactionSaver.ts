import Reaction from "../../model/Reaction";

class ReactionSaver {

    public static saveReaction(reaction: Reaction) {
        localStorage.setItem(reaction.uuid, JSON.stringify(reaction))
    }

}

export default ReactionSaver