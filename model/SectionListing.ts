import ReactionListing from "./ReactionListing";

interface Section {

    name: string,
    order: number,
    reactionListings: ReactionListing[],
    creationDate: string,
    authorId: string,
    uuid: string

}

export default Section