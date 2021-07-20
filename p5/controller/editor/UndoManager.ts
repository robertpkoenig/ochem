import Reaction from "../../model/Reaction"
import ReactionLoader from "../../utilities/ReactionLoader"
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

        const oldModel = this.editorController.reaction
        const oldModelJSON = JSON.stringify(oldModel)
        
        this.undoStack.push(oldModelJSON)
        
        this.clearRedoStack()
        
    }

    addRedoPoint() {
        const currentModel = this.editorController.reaction
        const currentModelJSON = JSON.stringify(currentModel)
        this.redoStack.push(currentModelJSON)
    }

    undo() {
        const previousModelJSON = this.undoStack.pop()
        if (previousModelJSON) {
            this.addRedoPoint()
            const previousModel: Reaction = ReactionLoader.loadReactionFromJSON(previousModelJSON)
            this.editorController.reaction.replaceWithNewModel(previousModel)
        }
    }

    getUndoStackHead(): Reaction | null {
        const previousModelJSON = this.undoStack.pop()
        if (previousModelJSON) {
            this.addRedoPoint()
            const previousModel: Reaction = ReactionLoader.loadReactionFromJSON(previousModelJSON)
            return previousModel
        }
        return null
    }

    redo() {

        const reactionStateToRestore = this.redoStack.pop()

        if (reactionStateToRestore) {
            const currentModel = this.editorController.reaction.currentStep
            const currentModelJSON = JSON.stringify(currentModel)
            this.undoStack.push(currentModelJSON)
            const previousModel: Reaction = ReactionLoader.loadReactionFromJSON(reactionStateToRestore)
            this.editorController.reaction.replaceWithNewModel(previousModel)
        }

    }

    clearRedoStack() {
        this.redoStack = []
    }

}

export default UndoManager