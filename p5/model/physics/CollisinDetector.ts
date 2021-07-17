import Reaction from "../Reaction"
import SAT, { Circle, Polygon, Vector } from 'sat'
import { Body } from "./Body"
import { Bond } from "../chemistry/bonds/Bond"
import p5 from "p5"
import { CurlyArrow } from "../chemistry/CurlyArrow"

class CollisionDetector {

    p5: p5
    reaction: Reaction

    constructor(p5: p5, reaction: Reaction) {
        this.p5 = p5
        this.reaction = reaction
    }

    twoBodiesOverlap(bodyOne: Body, bodyTwo: Body): boolean {
        const circleOne = new SAT.Circle(bodyOne.circle.pos, bodyOne.radius)
        const circleTwo = new SAT.Circle(bodyTwo.circle.pos, bodyTwo.radius)
        return SAT.testCircleCircle(circleOne, circleTwo)
    }

    mouseHoveredOverBody(body: Body): boolean {
        const mousePosition = new Vector(this.p5.mouseX, this.p5.mouseY)
        return SAT.pointInCircle(mousePosition, body.circle)
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

}

export default CollisionDetector