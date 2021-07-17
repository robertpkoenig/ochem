import { Circle, Vector } from "sat"
import { Bond } from "../chemistry/bonds/Bond"

class Body {

    public bonds: Bond[]
    // public pos: Vector
    public circle: Circle
    public force: Vector
    public mass: number
    public radius: number
    // public molecule: Molecule

    constructor(
        mass: number,
        radius: number
    ) {
        this.bonds = []
        // this.pos = new Vector(0, 0)
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