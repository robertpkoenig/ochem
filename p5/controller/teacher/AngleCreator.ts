
import { Vector } from "sat";
import Constants from "../../Constants";
import { Bond } from "../../model/chemistry/bonds/Bond";
import Reaction from "../../model/Reaction";
import Utilities from "../../utilities/Utilities";
import TeacherController from "./TeacherController";
import ReactionSaver from "./ReactionSaver";
import { v4 as uuid } from 'uuid'
import { AtomFactory } from "../../model/chemistry/atoms/AtomFactory";

class AngleCreator {

    // upstream objects
	reaction: Reaction
    editorController: TeacherController

	constructor(reaction: Reaction, teacherController: TeacherController) {
		this.reaction = reaction
        this.editorController = teacherController
	}

	createAngleControlIfAtomClicked(mouseVector: Vector) {

        if (this.editorController.hoverDetector.atomCurrentlyHovered != null) {

            this.editorController.undoManager.addUndoPoint()

            const atomToWhichAngleControlBeingAdded = this.editorController.hoverDetector.atomCurrentlyHovered
            const dummyAtom = AtomFactory.createAtom("dummy", mouseVector.x, mouseVector.y)

            const molecule = Utilities.findMoleculeContainingAtom(this.reaction, atomToWhichAngleControlBeingAdded)
    
            molecule.atoms.push(dummyAtom)
    
            const newBond = new Bond(
                atomToWhichAngleControlBeingAdded,
                dummyAtom,
                Constants.BOND_DISTANCE,
                null,
                uuid()
            )
    
            molecule.bonds.push(newBond)
    
            atomToWhichAngleControlBeingAdded.bonds.push(newBond)
            dummyAtom.bonds.push(newBond)
    
            ReactionSaver.saveReaction(this.editorController.reaction)

        }

	}
}

export default AngleCreator
