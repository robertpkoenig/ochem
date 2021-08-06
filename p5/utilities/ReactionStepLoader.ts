import { Vector } from "sat"
import Constants from "../Constants"
import { Atom } from "../model/chemistry/atoms/Atom"
import { AtomFactory } from "../model/chemistry/atoms/AtomFactory"
import { Bond } from "../model/chemistry/bonds/Bond"
import { CurlyArrow } from "../model/chemistry/CurlyArrow"
import Molecule from "../model/chemistry/Molecule"
import StraightArrow from "../model/chemistry/StraightArrow"
import ReactionStep from "../model/ReactionStep"
import Utilities from "./Utilities"

class ReactionStepLoader {

    public static loadReactionStepFromPlainObject(reactionStepPlainObject: any): ReactionStep {
        
        const restoredMolecules: Molecule[] = []

        if (Object.keys(reactionStepPlainObject).includes("molecules")) {
            for (const savedMolecule of reactionStepPlainObject["molecules"]) {

                const newMolecule = new Molecule()
                restoredMolecules.push(newMolecule)

                for (const savedAtom of savedMolecule.atoms) {
                    const newAtom: Atom = AtomFactory.createAtom(
                                                                savedAtom.name,
                                                                savedAtom.x,
                                                                savedAtom.y,
                                                                )
                    newAtom.ion = savedAtom.ion
                    newAtom.uuid = savedAtom.id
                    newMolecule.atoms.push(newAtom)
                }

                for (const savedBond of savedMolecule.bonds) {                
                    const atomOne = Utilities.getAtomWithinMoleculeByID(newMolecule, savedBond["atomOne"])
                    const atomTwo = Utilities.getAtomWithinMoleculeByID(newMolecule, savedBond["atomTwo"])
                    const type = savedBond.type
                    const uuid = savedBond.uuid
                    const newBond = new Bond(atomOne, atomTwo, Constants.BOND_DISTANCE, type, uuid)
                    newMolecule.bonds.push(newBond)
                    atomOne.bonds.push(newBond)
                    atomTwo.bonds.push(newBond)
                }

            }
        }

        const order = reactionStepPlainObject["order"]
        const restoredReactionStep = new ReactionStep(order)

        const uuid = reactionStepPlainObject["uuid"]
        restoredReactionStep.uuid = uuid
        restoredReactionStep.molecules.push(...restoredMolecules)
        
        // Restore the straight arrow
        const savedStraightArrow =
            JSON.parse(reactionStepPlainObject["straightArrow"])
        
        if (savedStraightArrow != null) {

            const straightArrowStartVector = new Vector(
                savedStraightArrow.startVector.x,
                savedStraightArrow.startVector.y,
                )
    
            const straightArrowEndVector = new Vector(
                savedStraightArrow.endVector.x,
                savedStraightArrow.endVector.y,
                )
    
            const trianglePointOne = new Vector(
                savedStraightArrow.trianglePointOne.x,
                savedStraightArrow.trianglePointOne.y,
                )
    
            const trianglePointTwo = new Vector(
                savedStraightArrow.trianglePointTwo.x,
                savedStraightArrow.trianglePointTwo.y,
                )
    
            const restoredStraightArrow = 
                new StraightArrow(straightArrowStartVector)
            
            restoredStraightArrow.endVector = straightArrowEndVector
            restoredStraightArrow.trianglePointOne = trianglePointOne
            restoredStraightArrow.trianglePointTwo = trianglePointTwo

            restoredReactionStep.straightArrow = restoredStraightArrow

        }

        const savedCurlyArrow = reactionStepPlainObject["curlyArrow"]

        if (savedCurlyArrow != null) {
            const restoredCurlyArrow = new CurlyArrow(savedCurlyArrow.type)
            
            const bondsAndAtoms: (Atom | Bond)[] = [
                                    ...restoredReactionStep.getAllAtoms(),
                                    ...restoredReactionStep.getAllBonds()
                                  ]
            for (const object of bondsAndAtoms) {
                if (object.uuid === savedCurlyArrow.startObjectId) {
                    restoredCurlyArrow.startObject = object
                }
                if (object.uuid === savedCurlyArrow.endObjectId) {
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