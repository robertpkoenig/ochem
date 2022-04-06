import p5 from "p5"
import Constants from "../Constants"
import { Controller } from "../controller/Controller"
import { Atom } from "../model/chemistry/atoms/Atom"
import { Bond } from "../model/chemistry/bonds/Bond"
import BondType from "../model/chemistry/bonds/BondType"

// Performs student-specific rendering tasks.
class StudentView {

    p5: p5
    controller: Controller

    constructor(p5: p5, controller: Controller) {
        this.p5 = p5
        this.controller = controller
    }

    render() {
        this.decorateAtomIfHovered()
        this.decorateBondIfHovered()
    }

    decorateAtomIfHovered() {
        const hoveredAtom = this.controller.hoverDetector.atomCurrentlyHovered
        if (hoveredAtom != null) {
            this.drawAtomOutline(hoveredAtom, Constants.BLUE_OUTLINE_COLOR)
        }
    }

    drawAtomOutline(atom: Atom, color: string) {
        this.p5.push()
            this.p5.noFill()
            this.p5.stroke(color)
            this.p5.strokeWeight(Constants.OUTLINE_THICKNESS)
            this.p5.ellipse(atom.circle.pos.x,
                            atom.circle.pos.y,
                            atom.radius * 2 + Constants.OUTLINE_THICKNESS)
        this.p5.pop()
    }

    decorateBondIfHovered() {

        const hoveredBond = this.controller.hoverDetector.bondCurrentlyHovered

        if (hoveredBond != null) {
            console.log("hello");
            
            if (this.controller.page.state.arrowType != null) {
                this.drawBondOutline(hoveredBond, Constants.BLUE_OUTLINE_COLOR)
            }
        }

    }

    drawBondOutline(bond: Bond, color: string) {

        this.p5.push()

            if (bond.type == BondType.SINGLE) {
            this.p5.stroke(color)
            this.p5.strokeWeight(Constants.STROKE_WEIGHT + Constants.OUTLINE_THICKNESS * 2)
            this.p5.line(bond.atoms[0].circle.pos.x,
                bond.atoms[0].circle.pos.y,
                bond.atoms[1].circle.pos.x,
                bond.atoms[1].circle.pos.y)

            }

            if (bond.type == BondType.DOUBLE) {
                this.p5.strokeWeight(Constants.STROKE_WEIGHT * 3 + Constants.OUTLINE_THICKNESS * 2)
                this.p5.stroke(color)
                this.p5.line(bond.atoms[0].circle.pos.x,
                    bond.atoms[0].circle.pos.y,
                    bond.atoms[1].circle.pos.x,
                    bond.atoms[1].circle.pos.y)
                this.p5.strokeWeight(Constants.STROKE_WEIGHT)
                this.p5.stroke(255)
                this.p5.line(bond.atoms[0].circle.pos.x,
                    bond.atoms[0].circle.pos.y,
                    bond.atoms[1].circle.pos.x,
                    bond.atoms[1].circle.pos.y)
            }
    
        this.p5.pop()

    }

}

export default StudentView