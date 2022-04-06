import Constants from "../Constants";
import { Atom } from "../model/chemistry/atoms/Atom";
import { AtomFactory } from "../model/chemistry/atoms/AtomFactory";
import { Bond } from "../model/chemistry/bonds/Bond";
import Molecule from "../model/chemistry/Molecule";
import Reaction from "../model/Reaction";
import ReactionStep from "../model/ReactionStep";
import { v4 as uuid } from 'uuid'

class Utilities {

    public static findMoleculeContainingAtom(reaction: Reaction, atom: Atom): Molecule {
        for (const molecule of reaction.currentStep.molecules) {
            if (molecule.atoms.includes(atom)) return molecule
        }
        throw new Error("this atom is not in a molecule, which should be impossible")
    }

    public static printReactionState(reaction: Reaction) {

        console.log("molecules: ", reaction.currentStep.molecules.length);
        console.log("atoms: ", reaction.currentStep.getAllAtoms().length);
        console.log("bonds: ", reaction.currentStep.getAllBonds().length);

        console.log(JSON.stringify(reaction));
        

    }

    public static getAtomWithinMoleculeByID(molecule: Molecule, targetAtomId: string): Atom {
        for (const atom of molecule.atoms) {
            if (atom.uuid === targetAtomId) return atom
        }
        
        throw new Error("no atom with this ID exists")
    }

    public static generateUid() {
        return uuid()
    }

}

export default Utilities