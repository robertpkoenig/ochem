
import { Atom } from "../../../model/chemistry/atoms/Atom";
import { Bond } from "../../../model/chemistry/bonds/Bond";
import Molecule from "../../../model/chemistry/Molecule";
import Reaction from "../../../model/Reaction";
import Utilities from "../../../utilities/Utilities";
import TeacherController from "../TeacherController";
import ReactionSaver from "./ReactionSaver";
import { v4 as uuid } from 'uuid'
import { BOND_DISTANCE } from "../../../Constants";

/** Allows for bonds to be drawn between atoms */
class BondCreator {

    // upstream objects
	reaction: Reaction
    editorController: TeacherController

    // properties
	startAtom: Atom

	constructor(model: Reaction, editorController: TeacherController) {

		this.reaction = model
        this.editorController = editorController

		this.startAtom = null

	}

    startBondIfAtomClicked() {
        if (this.editorController.hoverDetector.atomCurrentlyHovered != null) {
            this.startAtom = this.editorController.hoverDetector.atomCurrentlyHovered
        }
    }

	completeBondIfReleasedOverAtom() {

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

    /** Updates the molecule graph with bond between startAtom and endAtom */
    createBond(endAtom: Atom) {

        this.editorController.undoManager.addUndoPoint()
        
        const moleculeOne = Utilities.findMoleculeContainingAtom(this.reaction, this.startAtom)
        const moleculeTwo = Utilities.findMoleculeContainingAtom(this.reaction, endAtom)

        // Put all atoms into the same molecule object
        Molecule.mergeTwoMolecules(this.reaction, moleculeOne, moleculeTwo)

        if (this.editorController.pageState.bondType == null) {
            throw new Error("Tried creating bond without bond type selected")
        }

        const newBond = new Bond(
            this.startAtom,
            endAtom,
            BOND_DISTANCE,
            this.editorController.pageState.bondType,
            uuid()
        )

        moleculeOne.bonds.push(newBond)

        this.startAtom.bonds.push(newBond)
        endAtom.bonds.push(newBond)

        ReactionSaver.saveReaction(this.editorController.reaction)
            
    }

}

export default BondCreator
