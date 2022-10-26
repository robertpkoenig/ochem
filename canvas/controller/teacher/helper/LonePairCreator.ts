import LonePair from "../../../model/chemistry/atoms/LonePair";
import Reaction from "../../../model/Reaction";
import TeacherController from "../TeacherController";
import ReactionSaver from "./ReactionSaver";
import { v4 as uuid } from "uuid";

class LonePairCreator {
  reaction: Reaction;
  teacherController: TeacherController;

  constructor(reaction: Reaction, teacherController: TeacherController) {
    this.reaction = reaction;
    this.teacherController = teacherController;
  }

  // Cation is positive, Anion is negative
  createLonePairIfAtomClicked() {
    this.teacherController.undoManager.addUndoPoint();
    const atomClicked =
      this.teacherController.hoverDetector.atomCurrentlyHovered;
    if (atomClicked != null) {
      const lonePair = new LonePair(atomClicked, uuid());
      atomClicked.lonePair = lonePair;
    }
    ReactionSaver.saveReaction(this.reaction);
  }
}

export default LonePairCreator;
