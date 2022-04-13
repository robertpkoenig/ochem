import { Circle, Vector } from "sat"
import { Bond } from "../chemistry/bonds/Bond"

/**
 * High level class for any circular body on the canvas.
 * Extended by Atom.
 */
class Body {

    public bonds: Bond[]
    public circle: Circle
    public force: Vector
    public mass: number
    public radius: number

    constructor(
        mass: number,
        radius: number
    ) {
        this.bonds = []
        this.circle = new Circle(new Vector(), radius)
        this.force = new Vector(0, 0)
        this.mass = mass
        this.radius = radius
    }

    setPosCoordinates(x: number, y: number) {
        this.circle.pos.y = y
        this.circle.pos.x = x
    }

    addBond(bond: Bond) {
        this.bonds.push(bond)
    }

}

export { Body }