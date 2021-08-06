import DeleteManager from "./DeleteManager";
import Reaction from "../../model/Reaction";
import ReactionSaver from "./ReactionSaver";
import TeacherController from "./TeacherController";

class Eraser {

    reaction: Reaction
    editorController: TeacherController

    constructor(reaction: Reaction, editorController: TeacherController) {
        this.reaction = reaction
        this.editorController = editorController
    }

    eraseAnythingClicked() {
        this.eraseIonIfClicked()
        this.eraseAtomIfClicked()
        this.eraseBondIfClicked()
        this.eraseArrowIfClicked()
        this.eraseStraightArrowIfClicked()
    }

    eraseIonIfClicked() {
        
        const ionCurrentlyHovered =
            this.editorController.hoverDetector.ionCurrentlyHovered

        if (ionCurrentlyHovered != null) {
            this.editorController.undoManager.addUndoPoint()
            ionCurrentlyHovered.ion = null
            ReactionSaver.saveReaction(this.editorController.reaction)
        }

    }

    eraseAtomIfClicked() {
        
        const atomCurrentlyHovered =
            this.editorController.hoverDetector.atomCurrentlyHovered

        if (atomCurrentlyHovered != null) {
            this.editorController.undoManager.addUndoPoint()
            DeleteManager.deleteAtom(this.reaction, atomCurrentlyHovered)
            ReactionSaver.saveReaction(this.editorController.reaction)
        }

    }

    eraseBondIfClicked() {

        const bondCurrentlyHovered =
            this.editorController.hoverDetector.bondCurrentlyHovered

        if (bondCurrentlyHovered != null) {
            this.editorController.undoManager.addUndoPoint()
            DeleteManager.deleteBond(this.reaction, bondCurrentlyHovered)
            ReactionSaver.saveReaction(this.editorController.reaction)
        }

    }

    eraseArrowIfClicked() {
        const arrowHovered = 
            this.editorController.hoverDetector.curlyArrowCurrentlyHovered
        if (arrowHovered != null) {
            this.editorController.undoManager.addUndoPoint()
            this.editorController.reaction.currentStep.curlyArrow = null
            ReactionSaver.saveReaction(this.editorController.reaction)
        }
    }

    eraseStraightArrowIfClicked() {
        const arrowHovered = 
            this.editorController.hoverDetector.straightArrowCurrentlyHovered
        if (arrowHovered != null) {
            this.editorController.undoManager.addUndoPoint()
            this.editorController.reaction.currentStep.straightArrow = null
            ReactionSaver.saveReaction(this.editorController.reaction)
        }
    }

}

export default Eraser