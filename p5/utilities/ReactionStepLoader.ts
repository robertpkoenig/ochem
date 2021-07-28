import Constants from "../Constants"
import { Atom } from "../model/chemistry/atoms/Atom"
import { AtomFactory } from "../model/chemistry/atoms/AtomFactory"
import { Bond } from "../model/chemistry/bonds/Bond"
import { CurlyArrow } from "../model/chemistry/CurlyArrow"
import Molecule from "../model/chemistry/Molecule"
import ReactionStep from "../model/ReactionStep"
import Utilities from "./Utilities"

class ReactionStepLoader {

    public static loadReactionStepFromPlainObject(reactionStepPlainObject: any): ReactionStep {
        
        const restoredMolecules: Molecule[] = []

        for (const savedMolecule of reactionStepPlainObject["molecules"]) {

            const newMolecule = new Molecule()
            restoredMolecules.push(newMolecule)
            
            for (const savedAtom of savedMolecule.atoms) {
                const newAtom: Atom = AtomFactory.createAtom(
                                                        savedAtom.name,
                                                        savedAtom.x,
                                                        savedAtom.y
                                                        )
                newAtom.id = savedAtom.id
                newMolecule.atoms.push(newAtom)
            }

            for (const savedBond of savedMolecule.bonds) {                
                const atomOne = Utilities.getAtomWithinMoleculeByID(newMolecule, savedBond["atomOne"])
                const atomTwo = Utilities.getAtomWithinMoleculeByID(newMolecule, savedBond["atomTwo"])
                const type = savedBond.type
                const newBond = new Bond(atomOne, atomTwo, Constants.BOND_DISTANCE, type)
                newMolecule.bonds.push(newBond)
                atomOne.bonds.push(newBond)
                atomTwo.bonds.push(newBond)
            }

        }

        const order = reactionStepPlainObject["order"]
        const uuid = reactionStepPlainObject["uuid"]

        const restoredReactionStep = new ReactionStep(order)
        restoredReactionStep.uuid = uuid
        restoredReactionStep.molecules.push(...restoredMolecules)

        const savedCurlyArrow = reactionStepPlainObject["curlyArrow"]

        if (savedCurlyArrow != null) {
            const restoredCurlyArrow = new CurlyArrow(savedCurlyArrow.type)
            
            const bondsAndAtoms: (Atom | Bond)[] = [
                                    ...restoredReactionStep.getAllAtoms(),
                                    ...restoredReactionStep.getAllBonds()
                                  ]
            for (const object of bondsAndAtoms) {
                if (object.id === savedCurlyArrow.startObjectId) {
                    restoredCurlyArrow.startObject = object
                }
                if (object.id === savedCurlyArrow.endObjectId) {
                    restoredCurlyArrow.endObject = object
                }
            }

            // restoredCurlyArrow.update()

            restoredReactionStep.curlyArrow = restoredCurlyArrow

        }

        return restoredReactionStep

    }

}

export default ReactionStepLoader