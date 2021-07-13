import Reaction from "./Reaction"

class Module {

    name: string
    creationDate: string
    authorId: string
    reactions: Reaction[]

    constructor(
        name: string,
        creationDate: string,
        authorId: string,
        reactions: Reaction[]
    ) {
        this.name = name
        this.creationDate = creationDate
        this.authorId = authorId
        this.reactions = reactions
    }

}

export default Module