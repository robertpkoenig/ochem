import { Atom } from "./chemistry/atoms/Atom"
import { Bond } from "./chemistry/bonds/Bond"
import { CurlyArrow } from "./chemistry/CurlyArrow"
import Molecule from "./chemistry/Molecule"
import { v4 as uuid } from 'uuid'
import StraightArrow from "./chemistry/StraightArrow"
import { Vector } from "sat"

class ReactionStep {

    public name: string
    public order: number
    public molecules: Molecule[]
    public curlyArrows: CurlyArrow[]
    public straightArrow: StraightArrow
    public uuid: string
    public promptText: string

    constructor(order: number) {
        this.name = null
        this.order = order
        this.molecules = []
        this.curlyArrows = []
        this.straightArrow = null
        this.uuid = uuid()
        this.promptText = ""
    }

    update() {
        // if (this.curlyArrow != null) {
        //     this.curlyArrow.update()
        // }
    }

    getAllAtoms(): Atom[] {
        const atoms: Atom[] = []
        for (const molecule of this.molecules) {
            atoms.push(...molecule.atoms)
        }
        return atoms
    }

    getAllBonds(): Bond[] {
        const bonds: Bond[] = []
        for (const molecule of this.molecules) {
            bonds.push(...molecule.bonds)
        }
        return bonds
    }

    replaceWithNewModel(newModel: ReactionStep) {
        Object.assign(this, newModel)
    }

    toJSON() {

        const moleculesAsPlainObjects = []
        for (const molecule of this.molecules) {
            moleculesAsPlainObjects.push(molecule.toJSON())
        }

        const curlyArrowAsPlainObjectArray = []

        for (const curlyArrow of this.curlyArrows) {
            curlyArrowAsPlainObjectArray.push(curlyArrow.toJSON())
        }

        const straightArrowAsPlainObject = 
            this.straightArrow ? JSON.stringify(this.straightArrow) : null

        return {
            name: this.name,
            order: this.order,
            molecules: moleculesAsPlainObjects,
            curlyArrows: curlyArrowAsPlainObjectArray,
            straightArrow: straightArrowAsPlainObject,
            uuid: this.uuid,
        }
    }

}

export default ReactionStep