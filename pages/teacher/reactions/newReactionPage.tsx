import { GetServerSideProps } from "next"
import { useEffect, useState } from "react"
import TeacherController from "../../../canvas/controller/teacher/TeacherController"
import Ion from "../../../canvas/model/chemistry/atoms/Ion"
import BondType from "../../../canvas/model/chemistry/bonds/BondType"
import { ArrowType } from "../../../canvas/model/chemistry/CurlyArrow"
import Reaction from "../../../canvas/model/Reaction"
import p5 from "p5"
import { FirebaseFirestore } from "firebase/firestore"

// Used during server side rendering to get the 
// reaction ID from the url path
export const getReactionIdFromUrlPath: GetServerSideProps = async (context) => {
    return {
        props: {
            reactionId: context.params.reactionId
        }, // will be passed to the page component as props
    }
}

interface IProps {
    reactionId: string
}

function TeacherReactionPage(props: IProps) {

    const [db, setDb] = useState<FirebaseFirestore>(null)

    const [p5, setP5] = useState<p5>(null)

    const [loading, setLoading] = useState<boolean>(true)
    const [reaction, setReaction] = useState<Reaction>(null)

    // Editor panel
    const [bondType, setBondType] = useState<BondType>(null)
    const [arrowType, setArrowType] = useState<ArrowType>(null)
    const [straightArrowSelected, setStraightArrowSelected] = useState<boolean>(false)
    const [selectedIon, setSelectedIon] = useState<Ion>(null)
    const [eraserOn, seteraserOn] = useState<boolean>(false)

    const [teacherController, setTeacherController] = useState<TeacherController>(null)

    // When an element is selected from the right elements panel, it goes into this state
    const [selectedElement, setSelectedElement] = useState<HTMLElement>(null)

    const [promptPopupVisible, setPromptPopupVisible] = useState<boolean>(false)
    const [renamePopupvisible, setRenamePopupVisible] = useState<boolean>(false)

    useEffect(() => {
        await loadReactionFromDatabase()
        
    })

    loadReactionFromDatabase() {
        db = getFirestore()

        const docRef = doc(this.db, REACTIONS, this.props.reactionId);
        const docSnap = await getDoc(docRef);
        const rawReactionObject = docSnap.data()
        const reaction = ReactionLoader.loadReactionFromObject(rawReactionObject)
        setReaction(reaction)
    }


    createP5ElementIfPageIsLoadedInBrowser() {

        if (!reaction) throw new Error("reaction not loaded")

        // If there's no window, we're still server side, and p5 can't start
        if (!window) return

        // Can't even attempt to load the code for p5 until the code is running client side
        // or else error will be thrown
        const createP5Context = (await import("../../../canvas/Sketch")).default
        createP5Context(this, UserType.TEACHER, reaction)

        setLoading(false)
    }

    return (
         
    )
}

export default  TeacherReactionPage