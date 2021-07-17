import DeleteManager from "./DeleteManager";
import { EditorController } from "./EditorController";
import Reaction from "../../model/Reaction";

class Eraser {

    reaction: Reaction
    editorController: EditorController

    constructor(reaction: Reaction, editorController: EditorController) {
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
        }

    }

    eraseBondIfClicked() {

        const bondCurrentlyHovered =
            this.editorController.hoverDetector.bondCurrentlyHovered

        if (bondCurrentlyHovered != null) {
            this.editorController.undoManager.addUndoPoint()
            DeleteManager.deleteBond(this.reaction, bondCurrentlyHovered)
        }

    }

    eraseArrowIfClicked() {
        const arrowHovered = 
            this.editorController.hoverDetector.arrowCurrentlyHovered
        if (arrowHovered != null) {
            this.editorController.undoManager.addUndoPoint()
            this.editorController.reaction.currentStep.curlyArrow = null
        }
    }

}

export default Eraser