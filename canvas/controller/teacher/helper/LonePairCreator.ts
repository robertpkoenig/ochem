import LonePair from "../../../model/chemistry/atoms/LonePair"
import Reaction from "../../../model/Reaction"
import TeacherController from "../TeacherController"
import ReactionSaver from "./ReactionSaver"

class LonePairCreator {

  reaction: Reaction
  teacherController: TeacherController

  constructor(reaction: Reaction, teacherController: TeacherController) {
      this.reaction = reaction
      this.teacherController = teacherController
  }

  // Cation is positive, Anion is negative
  createLonePairIfAtomClicked() {
      this.teacherController.undoManager.addUndoPoint()
      const atomClicked = this.teacherController.hoverDetector.atomCurrentlyHovered
      if (atomClicked != null) {
          const lonePair = new LonePair(atomClicked)
          atomClicked.lonePair = lonePair
      }
      ReactionSaver.saveReaction(this.reaction)
  }

}

export default LonePairCreator