import Reaction from "../Reaction"
import { Atom } from "./atoms/Atom"
import { Bond } from "./bonds/Bond"

class Molecule {

    atoms: Atom[]
    bonds: Bond[]

    constructor() {
        this.atoms = []
        this.bonds = []
    }

    // Push everything from molecule two to molecule one
    public static mergeTwoMolecules(reaction: Reaction, molOne: Molecule, molTwo: Molecule) {
        
        // if it's the same molecule, do nothing
        if (molOne == molTwo) return

        // move the atoms and bonds from molTwo to molOne
        molOne.atoms.push(...molTwo.atoms)
        molOne.bonds.push(...molTwo.bonds)

        // remove molecule two from the model
        reaction.currentStep.molecules =
            reaction.currentStep.molecules.filter(function(molecule) {
            return molecule != molTwo
        })

    }

}

export default Molecule