import p5 from "p5";
import { AtomFactory } from "../../../model/chemistry/atoms/AtomFactory";
import Molecule from "../../../model/chemistry/Molecule";
import Reaction from "../../../model/Reaction";
import ReactionSaver from "./ReactionSaver";
import TeacherController from "../TeacherController";
import { Atom } from "../../../model/chemistry/atoms/Atom";
import { Vector } from "sat";
import { v4 as uuid } from "uuid";

class SingleAtomMoleculeCreator {
  p5: p5;
  reaction: Reaction;
  editorController: TeacherController;

  constructor(p5: p5, model: Reaction, editorController: TeacherController) {
    this.p5 = p5;
    this.reaction = model;
    this.editorController = editorController;
  }

  createNewMoleculeWithOneAtomOfElementInEachStep(elementName: string) {
    this.editorController.undoManager.addUndoPoint();

    const atomUid = uuid();

    for (const step of this.reaction.steps) {
      const newAtom = AtomFactory.createAtom(
        elementName,
        atomUid,
        this.p5.mouseX / this.reaction.zoom,
        this.p5.mouseY / this.reaction.zoom
      );

      const newMolecule = new Molecule();
      newMolecule.atoms.push(newAtom);

      step.molecules.push(newMolecule);
    }

    ReactionSaver.saveReaction(this.editorController.reaction);
  }
}

export default SingleAtomMoleculeCreator;
