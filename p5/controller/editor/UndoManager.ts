import ReactionStepLoader from "../../utilities/ReactionStepLoader"
import Utilities from "../../utilities/Utilities"
import { EditorController } from "./EditorController"



class UndoManager {

    // upstream objects
    editorController: EditorController

    // properties
    undoStack: string[]
    redoStack: string[]

    constructor(editorController: EditorController) {
        this.editorController = editorController
        this.undoStack = []
        this.redoStack = []
    }

    addUndoPoint() {

        const oldModel = this.editorController.reaction.currentStep
        const oldModelJSON = JSON.stringify(oldModel)
        
        this.undoStack.push(oldModelJSON)
        
        this.clearRedoStack()
        
    }

    addRedoPoint() {
        const currentModel = this.editorController.reaction.currentStep
        const currentModelJSON = JSON.stringify(currentModel)
        this.redoStack.push(currentModelJSON)
    }

    undo() {
        if (this.undoStack.length > 0) {
            this.addRedoPoint()
            const previousModelJSON = this.undoStack.pop()
            const previousModel = ReactionStepLoader.loadReactionStateFromJSON(previousModelJSON)
            this.editorController.reaction.currentStep.replaceWithNewModel(previousModel)
        }
    }

    redo() {

        if (this.redoStack.length > 0) {
            const currentModel = this.editorController.reaction.currentStep
            const currentModelJSON = JSON.stringify(currentModel)
            this.undoStack.push(currentModelJSON)
            const previousModel = ReactionStepLoader.loadReactionStateFromJSON(this.redoStack.pop())
            this.editorController.reaction.currentStep.replaceWithNewModel(previousModel)
        }

    }

    clearRedoStack() {
        this.redoStack = []
    }

}

export default UndoManager