import { Atom } from "./Atom"
import { Elements, IAtomicElement } from "./elements"

class AtomFactory {
    
    static createAtom(name: string, atomUid: string, x: number, y: number): Atom {
        let newAtom = this.createAtomFromElement(name, atomUid)
        newAtom.setPosCoordinates(x, y)
        return newAtom
    }

    private static createAtomFromElement(name: string, atomUid: string): Atom {

        const element: IAtomicElement = Elements[name]
        if (!element) throw new Error("Attempted to get nonexistent element")

        return new Atom(element, atomUid) 

    }

}

export { AtomFactory }