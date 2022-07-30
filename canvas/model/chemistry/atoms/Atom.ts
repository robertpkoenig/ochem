import { Vector } from "sat"
import { Body } from "../../physics/Body"
import { IAtomicElement } from "./elements"
import { v4 as uuid } from 'uuid'
import LonePair from "./LonePair"

class Atom extends Body {

    public element: IAtomicElement
    public uuid: string
    public ionSymbol: string
    public lonePair: LonePair

    constructor(
        element: IAtomicElement,
        atomUid: string
    ) {
        super(element.mass, element.radius)
        this.element = element
        this.uuid = atomUid

        this.ionSymbol = null
    }

    toJSON() {
        return {
            x: this.circle.pos.x,
            y: this.circle.pos.y,
            name: this.element.name,
            id: this.uuid,
            ion: this.ionSymbol,
            lonePair: this.lonePair ? this.lonePair.toJSON() : null,
        }
    }

    getPosVector(): Vector {
        return this.circle.pos
    }

}

export { Atom }