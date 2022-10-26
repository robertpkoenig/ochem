import { Vector } from "sat";
import StraightArrow from "../../../model/chemistry/StraightArrow";
import Reaction from "../../../model/Reaction";
import ReactionSaver from "./ReactionSaver";
import TeacherController from "../TeacherController";

class StraightArrowCreator {
  reaction: Reaction;
  teacherController: TeacherController;
  draftArrow: StraightArrow;

  constructor(reaction: Reaction, teacherController: TeacherController) {
    this.reaction = reaction;
    this.teacherController = teacherController;
    this.draftArrow = null;
  }

  startArrow(mouseVector: Vector) {
    if (
      mouseVector.x > 0 &&
      mouseVector.x < this.teacherController.p5.width &&
      mouseVector.y > 0 &&
      mouseVector.y < this.teacherController.p5.height
    ) {
      this.draftArrow = new StraightArrow(mouseVector);
    }
  }

  completeStraightArrow(mouseVector: Vector) {
    this.teacherController.undoManager.addUndoPoint();
    this.draftArrow.endVector = mouseVector;
    this.reaction.currentStep.straightArrow = this.draftArrow;
    this.draftArrow = null;
    ReactionSaver.saveReaction(this.reaction);
  }
}

export default StraightArrowCreator;
