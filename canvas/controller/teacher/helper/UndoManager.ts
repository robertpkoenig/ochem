import Reaction from "../../../model/Reaction"
import ReactionLoader from "../../../utilities/ReactionLoader"
import Utilities from "../../../utilities/Utilities"
import ReactionSaver from "./ReactionSaver"
import TeacherController from "../TeacherController"

class UndoManager {

    // upstream objects
    editorController: TeacherController

    // properties
    undoStack: string[]
    redoStack: string[]

    constructor(editorController: TeacherController) {
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
            ReactionSaver.saveReaction(previousModel)
        }
    }

    redo() {

        const reactionStateToRestore = this.redoStack.pop()

        if (reactionStateToRestore) {
            const currentModel = this.editorController.reaction
            const currentModelJSON = JSON.stringify(currentModel)
            this.undoStack.push(currentModelJSON)
            const previousModel: Reaction = ReactionLoader.loadReactionFromJSON(reactionStateToRestore)
            this.editorController.reaction.replaceWithNewModel(previousModel)
            ReactionSaver.saveReaction(previousModel)
        }

    }

    clearRedoStack() {
        this.redoStack = []
    }

}

export default UndoManager