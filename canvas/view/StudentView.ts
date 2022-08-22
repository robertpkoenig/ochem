import p5 from "p5"
import { BLUE_OUTLINE_COLOR, LONE_PAIR_OUTLINE_RADIUS, OUTLINE_THICKNESS, STROKE_WEIGHT } from "../Constants"
import StudentController from "../controller/student/StudentController"
import { Atom } from "../model/chemistry/atoms/Atom"
import LonePair from "../model/chemistry/atoms/LonePair"
import { Bond } from "../model/chemistry/bonds/Bond"
import BondType from "../model/chemistry/bonds/BondType"
import { ArrowType } from "../model/chemistry/CurlyArrow"
import CurlyArrowViewer from "./CurlyArrowViewer"

// Performs student-specific rendering tasks.
class StudentView {

    p5: p5
    controller: StudentController
    curlyArrowViewer: CurlyArrowViewer

    constructor(p5: p5, controller: StudentController, curlyArrowViewer: CurlyArrowViewer) {
        this.p5 = p5
        this.controller = controller
        this.curlyArrowViewer = curlyArrowViewer
    }

    render() {
        this.decorateAtomIfHovered()
        this.decorateBondIfHovered()
        this.decorateLonePairIfHovered()
    }

    decorateAtomIfHovered() {
        const hoveredAtom = this.controller.hoverDetector.atomCurrentlyHovered
        if (hoveredAtom != null) {
            this.drawAtomOutline(hoveredAtom, BLUE_OUTLINE_COLOR)
        }
    }

    drawAtomOutline(atom: Atom, color: string) {
        this.p5.push()
            this.p5.noFill()
            this.p5.stroke(color)
            this.p5.strokeWeight(OUTLINE_THICKNESS)
            this.p5.ellipse(atom.circle.pos.x,
                            atom.circle.pos.y,
                            atom.radius * 2 + OUTLINE_THICKNESS)
        this.p5.pop()
    }

    decorateBondIfHovered() {

        const hoveredBond = this.controller.hoverDetector.bondCurrentlyHovered

        if (hoveredBond != null) {
            if (this.controller.pageState.arrowType != null) {
                this.drawBondOutline(hoveredBond, BLUE_OUTLINE_COLOR)
            }
        }

    }

    drawBondOutline(bond: Bond, color: string) {

        this.p5.push()

            if (bond.type == BondType.SINGLE) {
            this.p5.stroke(color)
            this.p5.strokeWeight(STROKE_WEIGHT + OUTLINE_THICKNESS * 2)
            this.p5.line(bond.atoms[0].circle.pos.x,
                bond.atoms[0].circle.pos.y,
                bond.atoms[1].circle.pos.x,
                bond.atoms[1].circle.pos.y)

            }

            if (bond.type == BondType.DOUBLE) {
                this.p5.strokeWeight(STROKE_WEIGHT * 3 + OUTLINE_THICKNESS * 2)
                this.p5.stroke(color)
                this.p5.line(bond.atoms[0].circle.pos.x,
                    bond.atoms[0].circle.pos.y,
                    bond.atoms[1].circle.pos.x,
                    bond.atoms[1].circle.pos.y)
                this.p5.strokeWeight(STROKE_WEIGHT)
                this.p5.stroke(255)
                this.p5.line(bond.atoms[0].circle.pos.x,
                    bond.atoms[0].circle.pos.y,
                    bond.atoms[1].circle.pos.x,
                    bond.atoms[1].circle.pos.y)
            }
    
        this.p5.pop()

    }

    private decorateLonePairIfHovered() {
      const hoveredLonePair = this.controller.hoverDetector.lonePairCurrentlyHovered
      if (hoveredLonePair) this.drawLonePairOutline(hoveredLonePair)
    }


    private drawLonePairOutline(lonePair: LonePair) {
      const curylArrowSelected = this.controller.pageState.arrowType === ArrowType.DOUBLE
      const x = lonePair.getPosVector().x
      const y = lonePair.getPosVector().y
      this.p5.push()
          this.p5.fill(BLUE_OUTLINE_COLOR)
          this.p5.stroke(BLUE_OUTLINE_COLOR)
          this.p5.strokeWeight(OUTLINE_THICKNESS)
          this.p5.ellipse(x, y, LONE_PAIR_OUTLINE_RADIUS)
      this.p5.pop()
    }

}

export default StudentView