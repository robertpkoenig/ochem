import { Vector } from "sat";
import Reaction from "../../model/Reaction";
import ReactionSaver from "./ReactionSaver";
import TeacherController from "./TeacherController";

class IonCreator {

    reaction: Reaction
    teacherController: TeacherController

    constructor(reaction: Reaction, teacherController: TeacherController) {
        this.reaction = reaction
        this.teacherController = teacherController
    }

    // Cation is positive, Anion is negative
    createIonIfAtomClicked(ionString: string) {
        this.teacherController.undoManager.addUndoPoint()
        const atomClicked = this.teacherController.hoverDetector.atomCurrentlyHovered
        if (atomClicked != null) {
            atomClicked.ionSymbol = ionString
        }
        ReactionSaver.saveReaction(this.reaction)
    }

}

export default IonCreator