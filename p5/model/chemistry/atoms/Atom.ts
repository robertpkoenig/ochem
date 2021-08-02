import { Vector } from "sat"
import { Body } from "../../physics/Body"
import { IAtomicElement } from "./elements"
import { v4 as uuid } from 'uuid'

class Atom extends Body {

    public element: IAtomicElement
    public uuid: string

    constructor(
        element: IAtomicElement
    ) {
        super(element.mass, element.radius)
        this.element = element
        this.uuid = uuid()
    }

    toJSON() {
        return {
            x: this.circle.pos.x,
            y: this.circle.pos.y,
            name: this.element.name,
            id: this.uuid 
        }
    }

    getPosVector(): Vector {
        return this.circle.pos
    }

}

export { Atom }