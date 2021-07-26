import DeleteManager from "./DeleteManager";
import { TeacherController } from "./EditorController";
import Reaction from "../../model/Reaction";
import ReactionSaver from "./ReactionSaver";

class Eraser {

    reaction: Reaction
    editorController: TeacherController

    constructor(reaction: Reaction, editorController: TeacherController) {
        this.reaction = reaction
        this.editorController = editorController
    }

    eraseAnythingClicked() {
        this.eraseAtomIfClicked()
        this.eraseBondIfClicked()
        this.eraseArrowIfClicked()
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
            this.editorController.hoverDetector.arrowCurrentlyHovered
        if (arrowHovered != null) {
            this.editorController.undoManager.addUndoPoint()
            this.editorController.reaction.currentStep.curlyArrow = null
            ReactionSaver.saveReaction(this.editorController.reaction)
        }
    }

}

export default Eraser