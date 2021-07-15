import Sections from "./SectionListing"

interface Module {

    name: string,
    creationDate: string,
    authorId: string,
    sections: Sections[],
    uuid: string,

}

export default Module