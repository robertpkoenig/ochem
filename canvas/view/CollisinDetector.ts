import Reaction from "../model/Reaction"
import SAT, { Circle, Polygon, Vector } from 'sat'
import { Bond } from "../model/chemistry/bonds/Bond"
import p5 from "p5"
import { CurlyArrow } from "../model/chemistry/CurlyArrow"
import { Atom } from "../model/chemistry/atoms/Atom"
import StraightArrow from "../model/chemistry/StraightArrow"
import { ION_ORBIT_RADIUS, ION_RADIUS } from "../Constants"

// Contains methods for checking if various elements
// visually overlap. It utilizes an open source collision
// detection library call SAT https://www.npmjs.com/package/sat
class CollisionDetector {

    p5: p5
    reaction: Reaction

    constructor(p5: p5, reaction: Reaction) {
        this.p5 = p5
        this.reaction = reaction
    }

    twoAtomsOverlap(atomOne: Atom, atomTwo: Atom): boolean {
        const circleOne = new SAT.Circle(atomOne.circle.pos, atomOne.radius)
        const circleTwo = new SAT.Circle(atomTwo.circle.pos, atomTwo.radius)
        return SAT.testCircleCircle(circleOne, circleTwo)
    }

    mouseHoveredOverAtom(atom: Atom): boolean {
        const mousePosition = new Vector(this.p5.mouseX, this.p5.mouseY)
        return SAT.pointInCircle(mousePosition, atom.circle)
    }

    mouseHoveredOverIon(atom: Atom) {
        const mouseVector = new Vector(this.p5.mouseX, this.p5.mouseY)
        const ionX = atom.getPosVector().x + ION_ORBIT_RADIUS
        const ionY = atom.getPosVector().y - ION_ORBIT_RADIUS
        const ionCoordinateVector = new Vector(ionX, ionY)
        const ionCircle = new SAT.Circle(ionCoordinateVector, ION_RADIUS / 2)
        return SAT.pointInCircle(mouseVector, ionCircle)
    }

    mouseHoveredOverBond(bond: Bond): boolean {
        const mouseVector = new Vector(this.p5.mouseX, this.p5.mouseY)
        const mouseCircle = new Circle(mouseVector, 10)
        const bondPolygon = new Polygon(new Vector, [
            bond.atoms[0].circle.pos,
            bond.atoms[1].circle.pos
        ])
        return SAT.testCirclePolygon(mouseCircle, bondPolygon)
    }

    mouseHoveredOverArrow(arrow: CurlyArrow): boolean {
        const mouseVector = new Vector(this.p5.mouseX, this.p5.mouseY)
        const mouseCircle = new Circle(mouseVector, 10)
        for (let i = 1 ; i < arrow.points.length ; i++) {
            const linePolygon = new Polygon(new Vector, [
                arrow.points[i - 1],
                arrow.points[i]
            ])
            if (SAT.testCirclePolygon(mouseCircle, linePolygon)) {
                return true
            }
        }
        return false
    }

    mouseHoveredOverStraightArrow(arrow: StraightArrow): boolean {
        const mouseVector = new Vector(this.p5.mouseX, this.p5.mouseY)
        const mouseCircle = new Circle(mouseVector, 10)
        const bondPolygon = new Polygon(new Vector, [
            arrow.startVector,
            arrow.endVector
        ])
        return SAT.testCirclePolygon(mouseCircle, bondPolygon)
    }

}

export default CollisionDetector