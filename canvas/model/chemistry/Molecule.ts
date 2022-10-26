import Reaction from "../Reaction";
import { Atom } from "./atoms/Atom";
import { Bond } from "./bonds/Bond";

class Molecule {
  atoms: Atom[];
  bonds: Bond[];

  constructor() {
    this.atoms = [];
    this.bonds = [];
  }

  toJSON() {
    const atomsAsPlainObjectArray = [];
    for (const atom of this.atoms) {
      atomsAsPlainObjectArray.push(atom.toJSON());
    }

    const bondsAsPlainObjectArray = [];
    for (const bond of this.bonds) {
      bondsAsPlainObjectArray.push(bond.toJSON());
    }

    return {
      atoms: atomsAsPlainObjectArray,
      bonds: bondsAsPlainObjectArray,
    };
  }

  copy() {}

  // Push everything from molecule two to molecule one
  public static mergeTwoMolecules(
    reaction: Reaction,
    molOne: Molecule,
    molTwo: Molecule
  ) {
    // if it's the same molecule, do nothing
    if (molOne == molTwo) return;

    // move the atoms and bonds from molTwo to molOne
    molOne.atoms.push(...molTwo.atoms);
    molOne.bonds.push(...molTwo.bonds);

    if (!reaction.currentStep)
      throw new Error("reaciton has no current step defined");

    // remove molecule two from the model
    reaction.currentStep.molecules = reaction.currentStep.molecules.filter(
      function (molecule) {
        return molecule != molTwo;
      }
    );
  }
}

export default Molecule;
