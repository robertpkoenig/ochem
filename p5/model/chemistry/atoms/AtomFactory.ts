import ReactionStep from "../../ReactionStep"
import { Atom } from "./Atom"
import { AtomicElements, IAtomicElement } from "./elements"

class AtomFactory {
    
    static createAtom(name: string, x: number, y: number): Atom {
        let newAtom = this.createAtomFromElement(name)
        newAtom.setPosCoordinates(x, y)
        return newAtom
    }

    private static createAtomFromElement(name: string): Atom {

        const element: IAtomicElement = AtomicElements[name]
        if (!element) throw new Error("Attempted to get nonexistent element")

        return new Atom(
            element
        ) 

    }

}

export { AtomFactory }