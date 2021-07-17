import { Vector } from "sat"
import { Atom } from "../model/chemistry/atoms/Atom"
import { Bond } from "../model/chemistry/bonds/Bond"
import { CurlyArrow } from "../model/chemistry/CurlyArrow"
import Reaction from "../model/Reaction"
import { EditorController } from "./editor/EditorController"

class ArrowCreator {

    // upstream objects
	reaction: Reaction
    editorController: EditorController

    draftArrow: CurlyArrow

    constructor(reaction: Reaction, editorController: EditorController) {
        this.reaction = reaction
        this.editorController = editorController

        this.draftArrow = null
    }

    startArrowIfObjectClicked(mouseVector: Vector) {
       this.startArrowIfAtomClicked(mouseVector) 
       this.startArrowIfBondClicked(mouseVector) 
	}

    private startArrowIfAtomClicked(mouseVector: Vector) {
        const hoveredAtom = this.editorController.hoverDetector.atomCurrentlyHovered
        if (hoveredAtom != null) {
            const newArrow = new CurlyArrow (
                this.editorController.panelController.curlyArrowType
            )
            newArrow.setStartObject(hoveredAtom)
            this.draftArrow = newArrow
        }
    }

    private startArrowIfBondClicked(mouseVector: Vector) {
        const hoveredBond = this.editorController.hoverDetector.bondCurrentlyHovered
        if (hoveredBond != null) {
            const newArrow = new CurlyArrow (
                this.editorController.panelController.curlyArrowType
            )
            newArrow.setStartObject(hoveredBond)
            this.draftArrow = newArrow
        }
    }

    completeArrowIfReleasedOverObject() {
        this.completeArrowIfReleasedOverAtom()
        this.completeArrowIfReleasedOverBond()
        this.draftArrow = null
	}

    private completeArrowIfReleasedOverAtom() {

        const atomCurrentlyHovered = 
            this.editorController.hoverDetector.atomCurrentlyHovered

		if (atomCurrentlyHovered != null &&
            this.draftArrow.startObject != atomCurrentlyHovered) {

            this.editorController.undoManager.addUndoPoint()

            this.draftArrow.setEndObject(atomCurrentlyHovered)

            this.editorController.reaction.currentStep.curlyArrow =
                this.draftArrow

		}

    }

    private completeArrowIfReleasedOverBond() {

        const bondCurrentlyHovered = 
            this.editorController.hoverDetector.bondCurrentlyHovered

		if (bondCurrentlyHovered != null &&
            this.draftArrow.startObject != bondCurrentlyHovered) {

            this.editorController.undoManager.addUndoPoint()

            this.draftArrow.setEndObject(bondCurrentlyHovered)

            this.editorController.reaction.currentStep.curlyArrow =
                this.draftArrow

		}

    }

}

export default ArrowCreator