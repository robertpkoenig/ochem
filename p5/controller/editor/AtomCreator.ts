import p5 from "p5";
import { AtomFactory } from "../../model/chemistry/atoms/AtomFactory";
import Molecule from "../../model/chemistry/Molecule";
import Reaction from "../../model/Reaction";
import { EditorController } from "./EditorController";

class SingleAtomMoleculeCreator {

	p5: p5
	reaction: Reaction
    editorController: EditorController

	constructor(p5: p5, model: Reaction, editorController: EditorController) {
        this.p5 = p5
		this.reaction = model
        this.editorController = editorController
	}

	createNewSingleAtomMolecule(elementName: string) {

        this.editorController.undoManager.addUndoPoint()

        const newAtom = AtomFactory.createAtom(elementName, this.p5.mouseX, this.p5.mouseY)
        const newMolecule = new Molecule()
        newMolecule.atoms.push(newAtom)
        this.reaction.currentStep.molecules.push(newMolecule)
        
    }

}

export default SingleAtomMoleculeCreator