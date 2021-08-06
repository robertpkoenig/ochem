import { Atom } from "./chemistry/atoms/Atom"
import { Bond } from "./chemistry/bonds/Bond"
import { CurlyArrow } from "./chemistry/CurlyArrow"
import Molecule from "./chemistry/Molecule"
import { v4 as uuid } from 'uuid'
import StraightArrow from "./chemistry/StraightArrow"

class ReactionStep {

    public name: string
    public order: number
    public molecules: Molecule[]
    public curlyArrow: CurlyArrow
    public straightArrow: StraightArrow
    public uuid: string
    public promptText: string

    constructor(order: number) {
        this.name = null
        this.order = order
        this.molecules = []
        this.curlyArrow = null
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

        const curlyArrowAsPlainObject =
            this.curlyArrow ? this.curlyArrow.toJSON() : null

        const straightArrowAsPlainObject = 
            this.straightArrow ? JSON.stringify(this.straightArrow) : null

        return {
            name: this.name,
            order: this.order,
            molecules: moleculesAsPlainObjects,
            curlyArrow: curlyArrowAsPlainObject,
            straightArrow: straightArrowAsPlainObject,
            uuid: this.uuid,
        }
    }

}

export default ReactionStep