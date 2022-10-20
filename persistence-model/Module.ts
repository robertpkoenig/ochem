
import SectionListing from "./SectionListing"

interface Module {

    title: string,
    subtitle: string,
    creationDate: string,
    authorId: string,
    sections: {
        [sectionId: string]: SectionListing;
    },
    uuid: string,

}

export default Module