import { Vector } from "sat"
import { Body } from "../../physics/Body"
import { IAtomicElement } from "./elements"
import { v4 as uuid } from 'uuid'
import LonePair from "./LonePair"
import Ion from "./Ion"

class Atom extends Body {

    element: IAtomicElement
    uuid: string
    lonePair: LonePair
    ion: Ion 

    constructor(
        element: IAtomicElement,
        atomUid: string
    ) {
        super(element.mass, element.radius)
        this.element = element
        this.uuid = atomUid
    }

    toJSON() {
        return {
            x: this.circle.pos.x,
            y: this.circle.pos.y,
            name: this.element.name,
            id: this.uuid,
            ion: this.ion ? this.ion.toJSON() : null,
            lonePair: this.lonePair ? this.lonePair.toJSON() : null,
        }
    }

    getPosVector(): Vector {
        return this.circle.pos
    }

}

export { Atom }