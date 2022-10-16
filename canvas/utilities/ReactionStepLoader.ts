import { Vector } from "sat"
import { BOND_DISTANCE } from "../Constants"
import { Atom } from "../model/chemistry/atoms/Atom"
import { AtomFactory } from "../model/chemistry/atoms/AtomFactory"
import Ion from "../model/chemistry/atoms/Ion"
import LonePair from "../model/chemistry/atoms/LonePair"
import { Bond } from "../model/chemistry/bonds/Bond"
import { CurlyArrow } from "../model/chemistry/CurlyArrow"
import Molecule from "../model/chemistry/Molecule"
import StraightArrow from "../model/chemistry/StraightArrow"
import ReactionStep from "../model/ReactionStep"
import Utilities from "./Utilities"

/** De-serializes a single step in a reaction */
class ReactionStepLoader {

    public static loadReactionStepFromPlainObject(reactionStepPlainObject: any): ReactionStep {

        const restoredMolecules: Molecule[] = []

        if (Object.keys(reactionStepPlainObject).includes("molecules")) {
            for (const savedMolecule of reactionStepPlainObject["molecules"]) {

                const newMolecule = new Molecule()
                restoredMolecules.push(newMolecule)

                for (const savedAtom of savedMolecule.atoms) {
                    const newAtom: Atom = 
                      AtomFactory.createAtom(savedAtom.name, savedAtom.uuid, savedAtom.x, savedAtom.y)
                    newAtom.ion = savedAtom.ion
                    newAtom.uuid = savedAtom.id

                    if (savedAtom.ion != null) {
                      const ion = new Ion(savedAtom.ion.type, newAtom, savedAtom.ion.uuid, savedAtom.ion.angle)
                      newAtom.ion = ion
                    }

                    if (savedAtom.lonePair != null) {
                      const lonePair = new LonePair(newAtom, savedAtom.lonePair.uuid, savedAtom.lonePair.angle)
                      newAtom.lonePair = lonePair
                    }

                    newMolecule.atoms.push(newAtom)
                }

                for (const savedBond of savedMolecule.bonds) {                
                    const atomOne = Utilities.getAtomWithinMoleculeByID(newMolecule, savedBond["atomOne"])
                    const atomTwo = Utilities.getAtomWithinMoleculeByID(newMolecule, savedBond["atomTwo"])
                    const type = savedBond.type
                    const uuid = savedBond.uuid
                    const newBond = new Bond(atomOne, atomTwo, BOND_DISTANCE, type, uuid)
                    newMolecule.bonds.push(newBond)
                    atomOne.bonds.push(newBond)
                    atomTwo.bonds.push(newBond)
                }

            }
        }

        const order = reactionStepPlainObject["order"]
        const restoredReactionStep = new ReactionStep(order)
        // Confirmed curly arrows is array here
        // console.log('restoredReactionStep.curlyArrows.length : ' + restoredReactionStep.curlyArrows.length)
        // console.log(restoredReactionStep.curlyArrows.constructor.name)

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

        const savedCurlyArrows = reactionStepPlainObject["curlyArrows"]

        for (const savedCurlyArrow of savedCurlyArrows) {
            
            const restoredCurlyArrow = new CurlyArrow(savedCurlyArrow.type)
            
            const possibleStartObjects: (Atom | Bond | LonePair | Ion)[] = [
                ...restoredReactionStep.getAllAtoms(),
                ...restoredReactionStep.getAllBonds(),
                ...restoredReactionStep.getAllLonePairs(),
                ...restoredReactionStep.getAllIons(),
              ]

            for (const object of possibleStartObjects) {
                if (object.uuid === savedCurlyArrow.startObjectId) {
                    restoredCurlyArrow.startObject = object
                }
            }

            const possibleEndObjects: (Atom | Bond | LonePair | Ion)[] = [
                ...restoredReactionStep.getAllAtoms(),
                ...restoredReactionStep.getAllBonds(),
                ...restoredReactionStep.getAllLonePairs(),
                ...restoredReactionStep.getAllIons(),
              ]
            
            for (const object of possibleEndObjects) {
                if (object.uuid === savedCurlyArrow.endObjectId) {
                    restoredCurlyArrow.endObject = object
                }
            }
            restoredReactionStep.curlyArrows.push(restoredCurlyArrow)

        }

        return restoredReactionStep

    }

}

export default ReactionStepLoader