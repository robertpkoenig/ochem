import { IPageState } from "../../pages/teacher/reactions/[reactionId]"
import { CurlyArrow } from "../model/chemistry/CurlyArrow"
import Reaction from "../model/Reaction"
import HoverDetector from "./teacher/helper/HoverDetector"
import ReactionSaver from "./teacher/helper/ReactionSaver"
import UndoManager from "./teacher/helper/UndoManager"

class CurlyArrowCreator {

    // upstream objects
	reaction: Reaction
    hoverDetector: HoverDetector
    undoManager: UndoManager
    pageState: IPageState

    // properties
    draftArrow: CurlyArrow

    constructor(
        reaction: Reaction,
        hoverDetecter: HoverDetector,
        pageState: IPageState) {

        this.reaction = reaction
        this.hoverDetector = hoverDetecter
        this.pageState = pageState

        this.draftArrow = null

        // Undo manager is set from the editor controller because
        // that is where the undo manager is created
    }

    startArrowIfObjectClicked() {
       this.startArrowIfAtomClicked() 
       this.startArrowIfBondClicked() 
	}

    private startArrowIfAtomClicked() {
        const hoveredAtom = this.hoverDetector.atomCurrentlyHovered
        if (hoveredAtom != null) {
            const newArrow = new CurlyArrow (
                this.pageState.arrowType
            )
            newArrow.setStartObject(hoveredAtom)
            this.draftArrow = newArrow
        }
    }

    private startArrowIfBondClicked() {
        const hoveredBond = this.hoverDetector.bondCurrentlyHovered
        if (hoveredBond != null) {
            const newArrow = new CurlyArrow (
                this.pageState.arrowType
            )
            newArrow.setStartObject(hoveredBond)
            this.draftArrow = newArrow
        }
    }

    completeTeacherArrowIfReleasedOverObject() {
        this.completeArrowIfReleasedOverAtom()
        this.completeArrowIfReleasedOverBond()
        this.draftArrow = null
	}

    private completeArrowIfReleasedOverAtom() {

        const atomCurrentlyHovered = 
            this.hoverDetector.atomCurrentlyHovered

		if (atomCurrentlyHovered != null &&
            this.draftArrow.startObject != atomCurrentlyHovered) {

            this.undoManager.addUndoPoint()

            this.draftArrow.setEndObject(atomCurrentlyHovered)

            this.reaction.currentStep.curlyArrow =
                this.draftArrow

            ReactionSaver.saveReaction(this.reaction)

		}

    }

    private completeArrowIfReleasedOverBond() {

        const bondCurrentlyHovered = 
            this.hoverDetector.bondCurrentlyHovered

		if (bondCurrentlyHovered != null &&
            this.draftArrow.startObject != bondCurrentlyHovered) {

            this.undoManager.addUndoPoint()

            this.draftArrow.setEndObject(bondCurrentlyHovered)

            this.reaction.currentStep.curlyArrow =
                this.draftArrow

            ReactionSaver.saveReaction(this.reaction)
		}

    }

    completeStudentArrowIfReleasedOverObject() {
        this.completeStudentArrowIfReleasedOverAtom()
        this.completeStudentArrowIfReleasedOverBond()
	}

    private completeStudentArrowIfReleasedOverAtom() {

        const atomCurrentlyHovered = 
            this.hoverDetector.atomCurrentlyHovered

		if (atomCurrentlyHovered != null &&
            this.draftArrow.startObject != atomCurrentlyHovered) {

            this.draftArrow.setEndObject(atomCurrentlyHovered)

		}

    }

    private completeStudentArrowIfReleasedOverBond() {

        const bondCurrentlyHovered = 
            this.hoverDetector.bondCurrentlyHovered

		if (bondCurrentlyHovered != null &&
            this.draftArrow.startObject != bondCurrentlyHovered) {

            this.draftArrow.setEndObject(bondCurrentlyHovered)

		}

    }

}

export default CurlyArrowCreator