import { Vector } from "sat"
import StudentReactionPage from "../../pages/student/reactions/[reactionId]"
import TeacherReactionPage from "../../pages/teacher/reactions/[reactionId]"
import { CurlyArrow } from "../model/chemistry/CurlyArrow"
import Reaction from "../model/Reaction"
import HoverDetector from "./teacher/HoverDetector"
import ReactionSaver from "./teacher/ReactionSaver"
import UndoManager from "./teacher/UndoManager"

class CurlyArrowCreator {

    // upstream objects
	reaction: Reaction
    hoverDetector: HoverDetector
    undoManager: UndoManager
    page: TeacherReactionPage | StudentReactionPage

    draftArrow: CurlyArrow

    constructor(
        reaction: Reaction,
        hoverDetecter: HoverDetector,
        page: TeacherReactionPage | StudentReactionPage) {

        this.reaction = reaction
        this.hoverDetector = hoverDetecter
        this.page = page

        this.draftArrow = null

        // Undo manager is set from the editor controller because
        // that is where the undo manager is created
    }

    startArrowIfObjectClicked(mouseVector: Vector) {
       this.startArrowIfAtomClicked(mouseVector) 
       this.startArrowIfBondClicked(mouseVector) 
	}

    private startArrowIfAtomClicked(mouseVector: Vector) {
        const hoveredAtom = this.hoverDetector.atomCurrentlyHovered
        if (hoveredAtom != null) {
            const newArrow = new CurlyArrow (
                this.page.state.arrowType
            )
            newArrow.setStartObject(hoveredAtom)
            this.draftArrow = newArrow
        }
    }

    private startArrowIfBondClicked(mouseVector: Vector) {
        const hoveredBond = this.hoverDetector.bondCurrentlyHovered
        if (hoveredBond != null) {
            const newArrow = new CurlyArrow (
                this.page.state.arrowType
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