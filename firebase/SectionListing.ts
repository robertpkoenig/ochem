import ReactionListing from "./ReactionListing";

interface Section {

    name: string,
    order: number,
    creationDate: string,
    authorId: string,
    uuid: string
    reactionListings: {
        [reactionId: string]: ReactionListing
    }

}

export default Section