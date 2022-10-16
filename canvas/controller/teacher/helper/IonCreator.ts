import Reaction from "../../../model/Reaction";
import ReactionSaver from "./ReactionSaver";
import TeacherController from "../TeacherController";
import Ion, { IonType } from "../../../model/chemistry/atoms/Ion";
import { v4 as uuid } from 'uuid'

/** Add ions to atoms */
class IonCreator {

    reaction: Reaction
    teacherController: TeacherController

    constructor(reaction: Reaction, teacherController: TeacherController) {
        this.reaction = reaction
        this.teacherController = teacherController
    }

    // Cation is positive, Anion is negative
    createIonIfAtomClicked(type: IonType) {
        this.teacherController.undoManager.addUndoPoint()
        const atomClicked = this.teacherController.hoverDetector.atomCurrentlyHovered
        if (atomClicked != null) {
            const ion = new Ion(type, atomClicked, uuid())
            atomClicked.ion = ion
        }
        ReactionSaver.saveReaction(this.reaction)
    }

}

export default IonCreator