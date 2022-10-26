import Utilities from "../../../utilities/Utilities";
import Molecule from "../../../model/chemistry/Molecule";
import Reaction from "../../../model/Reaction";
import { Atom } from "../../../model/chemistry/atoms/Atom";
import { Bond } from "../../../model/chemistry/bonds/Bond";
import { Queue } from "typescript-collections";

/** Handles the cascade of model updates when deleting a bond or atom from the mocule graph */
class DeleteManager {
  public static deleteAtom(reaction: Reaction, atomToDelete: Atom) {
    this.deleteBondsAttachedToAtom(atomToDelete, reaction);
    this.deleteCurlyArrowsThatStartOrEndOnThisAtom(atomToDelete, reaction);
    this.removeReferencesToAtom(reaction, atomToDelete);
  }

  private static deleteBondsAttachedToAtom(atom: Atom, reaction: Reaction) {
    for (const bond of atom.bonds) {
      this.deleteBond(reaction, bond);
    }
  }

  private static removeReferencesToAtom(
    reaction: Reaction,
    atomToDelete: Atom
  ) {
    for (const step of reaction.steps) {
      for (const molecule of step.molecules) {
        if (molecule.atoms.includes(atomToDelete)) {
          // remove this atom from the molecule
          molecule.atoms = molecule.atoms.filter(
            (atom: Atom) => atom != atomToDelete
          );
          // remove this molecule from reaction if the molecule has no more atoms
          if (molecule.atoms.length == 0) {
            this.removeReferencesToMolecule(reaction, molecule);
          }
          return;
        }
      }
    }
  }

  private static deleteCurlyArrowsThatStartOrEndOnThisAtom(
    atom: Atom,
    reaction: Reaction
  ) {
    for (const step of reaction.steps) {
      for (const curlyArrow of step.curlyArrows) {
        if (curlyArrow.startObject == atom || curlyArrow.endObject == atom) {
          reaction.currentStep.curlyArrows =
            reaction.currentStep.curlyArrows.filter(
              (currArrow) => currArrow != curlyArrow
            );
        }
      }
    }
  }

  private static removeReferencesToMolecule(
    reaction: Reaction,
    molecule: Molecule
  ) {
    for (const step of reaction.steps) {
      step.molecules = reaction.currentStep.molecules.filter(
        (currMolecule: Molecule) => currMolecule != molecule
      );
    }
  }

  public static deleteBond(reaction: Reaction, bondToDelete: Bond) {
    this.removeAllReferencesToBond(bondToDelete, reaction);

    // for dummy angle control bonds
    if (bondToDelete.atoms[0].element.name == "dummy") {
      this.deleteAtom(reaction, bondToDelete.atoms[0]);
      return;
    }
    if (bondToDelete.atoms[1].element.name == "dummy") {
      this.deleteAtom(reaction, bondToDelete.atoms[1]);
      return;
    }

    const listOne = this.getListOfAtomsConnectedToAtom(bondToDelete.atoms[0]);
    const listTwo = this.getListOfAtomsConnectedToAtom(bondToDelete.atoms[1]);

    // If atoms are no longer connected, then remove the second atom from
    // the molecule, and add it to a new molecule
    if (!this.doListsHaveCommonItem(listOne, listTwo)) {
      this.assignListOfAtomsToNewMolecule(listTwo, reaction);
      const molOne = Utilities.findMoleculeContainingAtom(
        reaction,
        bondToDelete.atoms[0]
      );
      this.removeListOfAtomsFromMolecule(listTwo, molOne);
      // remove any items in listTwo from the molecule containing listOne
      molOne.atoms = molOne.atoms.filter((atom) => !listTwo.includes(atom));
    }

    this.resassignBondsToCorrectMolecules(reaction);
  }

  private static removeAllReferencesToBond(bond: Bond, reaction: Reaction) {
    // Remove references to this bond in any molecule
    for (const molecule of reaction.currentStep.molecules) {
      molecule.bonds = molecule.bonds.filter((currBond) => currBond != bond);
    }

    // Remove references to this bond within its bonded bodies
    for (const atom of bond.atoms) {
      atom.bonds = atom.bonds.filter((currBond) => currBond != bond);
    }
  }

  private static getListOfAtomsConnectedToAtom(atom: Atom): Atom[] {
    const q = new Queue<Atom>();
    q.enqueue(atom);

    // Must use body here as bond uses the Body type, rather than atom
    // because bonds can be between atoms and electrons
    const connectedAtoms: Atom[] = [];

    while (!q.isEmpty()) {
      const nextAtom = q.dequeue();

      if (!nextAtom) {
        throw new Error("this is a dummy error to keep TS happy");
      }

      // Add this item to the connected items list
      connectedAtoms.push(nextAtom);

      for (const bond of nextAtom.bonds) {
        for (const atom of bond.atoms) {
          // if this atom has not been seen, add it to the queue
          // and the list of connected bodies
          if (atom != nextAtom && !connectedAtoms.includes(atom)) {
            q.add(atom);
          }
        }
      }
    }

    return connectedAtoms;
  }

  private static doListsHaveCommonItem(
    listOne: Atom[],
    listTwo: Atom[]
  ): boolean {
    for (const body of listOne) {
      if (listTwo.includes(body)) {
        return true;
      }
    }

    return false;
  }

  private static assignListOfAtomsToNewMolecule(
    atoms: Atom[],
    reaction: Reaction
  ) {
    const newMolecule = new Molecule();
    newMolecule.atoms.push(...atoms);
    reaction.currentStep.molecules.push(newMolecule);
  }

  private static removeListOfAtomsFromMolecule(
    atoms: Atom[],
    molecule: Molecule
  ) {
    molecule.atoms = molecule.atoms.filter(
      (atom: Atom) => !atoms.includes(atom)
    );
  }

  private static resassignBondsToCorrectMolecules(reaction: Reaction): void {
    // gather all bonds
    const allBonds = reaction.currentStep.getAllBonds();

    // clear all bonds from molecules
    for (const molecule of reaction.currentStep.molecules) {
      molecule.bonds = [];
    }

    for (const bond of allBonds) {
      // assign the bond to the molcule that first atom is in
      const atomOne = bond.atoms[0];
      const moleculeContainingAtom = Utilities.findMoleculeContainingAtom(
        reaction,
        atomOne
      );
      moleculeContainingAtom.bonds.push(bond);
    }
  }
}

export default DeleteManager;
