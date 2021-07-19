import SAT from "sat";
import { Vector } from "sat";
import Constants from "../../Constants";
import { Atom } from "../../model/chemistry/atoms/Atom";
import { Bond } from "../../model/chemistry/bonds/Bond";
import Molecule from "../../model/chemistry/Molecule";
import Reaction from "../../model/Reaction";
import Utilities from "../../utilities/Utilities";
import { EditorController } from "./EditorController";

class BondCreator {

    // upstream objects
	reaction: Reaction
    editorController: EditorController

    // properties
	startAtom: Atom

	constructor(model: Reaction, editorController: EditorController) {

		this.reaction = model
        this.editorController = editorController

		this.startAtom = null

	}

	startBondIfAtomClicked(mouseVector: Vector) {
        if (this.editorController.hoverDetector.atomCurrentlyHovered != null) {
            this.startAtom = this.editorController.hoverDetector.atomCurrentlyHovered
        }
	}

	completeBondIfReleasedOverAtom(mouseVector: Vector) {

		if (this.startAtom == null) {
            return
        }

        const atomCurrentlyHovered = 
            this.editorController.hoverDetector.atomCurrentlyHovered

		if (atomCurrentlyHovered != null) {
            this.createBond(atomCurrentlyHovered)
		}

		this.startAtom = null
		
	}

    createBond(endAtom: Atom) {

        this.editorController.undoManager.addUndoPoint()
        
        const moleculeOne = Utilities.findMoleculeContainingAtom(this.reaction, this.startAtom)
        const moleculeTwo = Utilities.findMoleculeContainingAtom(this.reaction, endAtom)

        // Put all atoms into the same molecule object
        Molecule.mergeTwoMolecules(this.reaction, moleculeOne, moleculeTwo)

        if (this.editorController.reactionEditor.state.bondType == null) {
            throw new Error("Tried creating bond without bond type selected")
        }

        const newBond = new Bond(
            this.startAtom,
            endAtom,
            Constants.BOND_DISTANCE,
            this.editorController.reactionEditor.state.bondType
        )

        moleculeOne.bonds.push(newBond)

        this.startAtom.bonds.push(newBond)
        endAtom.bonds.push(newBond)
            
    }

}

export default BondCreator