import TeacherController from "../controller/teacher/TeacherController";
import { Atom } from "../model/chemistry/atoms/Atom";
import { Bond } from "../model/chemistry/bonds/Bond";
import BondType from "../model/chemistry/bonds/BondType";
import Reaction from "../model/Reaction";
import CollisionDetector from "./CollisinDetector";
import p5 from "p5";
import { CurlyArrow } from "../model/chemistry/CurlyArrow";
import StraightArrow from "../model/chemistry/StraightArrow";
import { ARROW_STROKE_WEIGHT, BLUE_OUTLINE_COLOR, ION_ORBIT_RADIUS, ION_RADIUS, OUTLINE_THICKNESS, RED_OUTLINE_COLOR, STROKE_WEIGHT } from "../Constants";
import LonePair from "../model/chemistry/atoms/LonePair";

/** Performs teacher-specific rendering tasks */
class TeacherView {

    p5: p5
    reaction: Reaction
    teacherController: TeacherController
    collisionDetector: CollisionDetector

    eraserTipVisible: boolean

    constructor(p5: p5,
                reaction: Reaction,
                editorController: TeacherController,
                collisionDetector: CollisionDetector) 
    {
        this.p5 = p5
        this.reaction = reaction
        this.teacherController = editorController
        this.collisionDetector = collisionDetector

        this.eraserTipVisible = false
    }

    render() {
        this.decorateIonIfHovered()
        this.decorateLonePairIfHovered()

        this.decorateAtomIfHovered()
        this.decorateBondIfHovered()
        this.decorateArrowIfHovered()
        this.decorateStraightArrowIfHovered()

        this.renderDraftBond()
        this.renderDraftStraightArrow()
    }

    private decorateIonIfHovered() {
        const hoveredIon = this.teacherController.hoverDetector.ionCurrentlyHovered

        if (hoveredIon != null) {
            if (this.teacherController.pageState.eraserOn) {
                this.drawIonOutline(hoveredIon)
                this.showEraserTip()
            }
        }

        else if (this.eraserTipVisible) {
            this.hideEraserTip()
        }
    }

    private decorateLonePairIfHovered() {
      const hoveredLonePair = this.teacherController.hoverDetector.lonePairCurrentlyHovered

      if (hoveredLonePair) {
          if (this.teacherController.pageState.eraserOn) {
              this.drawLonePairOutline(hoveredLonePair)
              this.showEraserTip()
          }
      }

      else if (this.eraserTipVisible) {
          this.hideEraserTip()
      }
  }

  private drawLonePairOutline(lonePair: LonePair) {
    const x = lonePair.getPosVector(this.p5).x
    const y = lonePair.getPosVector(this.p5).y
    this.p5.push()
        this.p5.noFill()
        this.p5.stroke(RED_OUTLINE_COLOR)
        this.p5.strokeWeight(OUTLINE_THICKNESS)
        this.p5.ellipse(x, y, ION_RADIUS + OUTLINE_THICKNESS)
    this.p5.pop()
  }

  private drawIonOutline(atom: Atom) {
      const x = atom.getPosVector().x - ION_ORBIT_RADIUS
      const y = atom.getPosVector().y - ION_ORBIT_RADIUS
      this.p5.push()
          this.p5.noFill()
          this.p5.stroke(RED_OUTLINE_COLOR)
          this.p5.strokeWeight(OUTLINE_THICKNESS)
          this.p5.ellipse(x, y, ION_RADIUS + OUTLINE_THICKNESS)
      this.p5.pop()
  }

  private decorateAtomIfHovered() {
      const hoveredAtom = this.teacherController.hoverDetector.atomCurrentlyHovered
      if (hoveredAtom != null) {
          if (this.teacherController.pageState.eraserOn) {
              this.drawAtomOutline(hoveredAtom, RED_OUTLINE_COLOR)
              this.showEraserTip()
          }
          else {
              this.drawAtomOutline(hoveredAtom, BLUE_OUTLINE_COLOR)
          }
      }
  }

  private drawAtomOutline(atom: Atom, color: string) {
      this.p5.push()
          this.p5.noFill()
          this.p5.stroke(color)
          this.p5.strokeWeight(OUTLINE_THICKNESS)
          this.p5.ellipse(atom.circle.pos.x,
                          atom.circle.pos.y,
                          atom.radius * 2 + OUTLINE_THICKNESS)
      this.p5.pop()
  }

    // Sets the position of the eraser tip DOM element based on
    // the p5 mouse position, and sets the eraser tip to visible
    private showEraserTip() {
        const eraserTip = this.p5.select("#eraser-tip")
        eraserTip.style("display", "inline")
        const boundingRect = this.teacherController.panelController.canvasParent.getBoundingClientRect()
        const x = this.p5.mouseX / this.reaction.zoom + boundingRect.x + 10
        const y = this.p5.mouseY  / this.reaction.zoom + boundingRect.y + 10
        eraserTip.position(x, y)

        this.eraserTipVisible = true
    }

    private hideEraserTip() {
        const eraserTip = this.p5.select("#eraser-tip")
        eraserTip.style("display", "none")

        this.eraserTipVisible = false
    }

    private decorateBondIfHovered() {

        const hoveredBond = this.teacherController.hoverDetector.bondCurrentlyHovered

        if (hoveredBond != null) {
            if (this.teacherController.pageState.eraserOn) {
                this.drawBondOutline(hoveredBond, RED_OUTLINE_COLOR)
                this.showEraserTip()
                this.eraserTipVisible = true
            }
            if (this.teacherController.pageState.arrowType != null) {
                this.drawBondOutline(hoveredBond, BLUE_OUTLINE_COLOR)
            }
        }

    }

    private drawBondOutline(bond: Bond, color: string) {

        this.p5.push()

            if (bond.type == BondType.SINGLE || bond.type == null) {
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

            if (bond.type == BondType.TRIPLE) {
                this.p5.strokeWeight(STROKE_WEIGHT * 5 + OUTLINE_THICKNESS * 2)
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

    private renderDraftBond() {
        
        if (this.teacherController.bondCreator.startAtom != null) {
            
            this.p5.push()

                this.p5.fill(0)

                if (this.teacherController.pageState.bondType == BondType.SINGLE) {
                this.p5.stroke(0)
                this.p5.line(this.teacherController.bondCreator.startAtom.circle.pos.x,
                    this.teacherController.bondCreator.startAtom.circle.pos.y,
                    this.p5.mouseX / this.reaction.zoom ,
                    this.p5.mouseY / this.reaction.zoom )
                }

                if (this.teacherController.pageState.bondType == BondType.DOUBLE) {
                    this.p5.strokeWeight(STROKE_WEIGHT * 3)
                    this.p5.stroke(0)
                    this.p5.line(this.teacherController.bondCreator.startAtom.circle.pos.x,
                        this.teacherController.bondCreator.startAtom.circle.pos.y,
                        this.p5.mouseX / this.reaction.zoom ,
                        this.p5.mouseY / this.reaction.zoom )
                    this.p5.strokeWeight(STROKE_WEIGHT)
                    this.p5.stroke(255)
                    this.p5.line(this.teacherController.bondCreator.startAtom.circle.pos.x,
                        this.teacherController.bondCreator.startAtom.circle.pos.y,
                        this.p5.mouseX / this.reaction.zoom ,
                        this.p5.mouseY / this.reaction.zoom )
                }

                if (this.teacherController.pageState.bondType == BondType.TRIPLE) {

                    this.p5.strokeWeight(STROKE_WEIGHT * 5)
                    this.p5.stroke(0)
                    this.p5.line(this.teacherController.bondCreator.startAtom.circle.pos.x, this.teacherController.bondCreator.startAtom.circle.pos.y,
                                 this.p5.mouseX / this.reaction.zoom , this.p5.mouseY / this.reaction.zoom )
    
                    this.p5.strokeWeight(STROKE_WEIGHT * 3)
                    this.p5.stroke(255)
                    this.p5.line(this.teacherController.bondCreator.startAtom.circle.pos.x, this.teacherController.bondCreator.startAtom.circle.pos.y,
                                 this.p5.mouseX / this.reaction.zoom , this.p5.mouseY / this.reaction.zoom )
    
                    this.p5.strokeWeight(STROKE_WEIGHT)
                    this.p5.stroke(0)
                    this.p5.line(this.teacherController.bondCreator.startAtom.circle.pos.x, this.teacherController.bondCreator.startAtom.circle.pos.y,
                                 this.p5.mouseX / this.reaction.zoom , this.p5.mouseY / this.reaction.zoom )
                }
                
            this.p5.pop()

        }
        
    }

    private decorateArrowIfHovered() {

        const arrow = this.teacherController.hoverDetector.curlyArrowCurrentlyHovered
        
        if (arrow != null && this.teacherController.pageState.eraserOn) {
            this.drawArrowOutline(arrow, RED_OUTLINE_COLOR)
            this.showEraserTip()
        }

    }

    private drawArrowOutline(arrow: CurlyArrow, color: string) {

        this.p5.push()

            this.p5.noFill()
            this.p5.stroke(color)

            this.p5.strokeWeight(
                ARROW_STROKE_WEIGHT +
                OUTLINE_THICKNESS * 2
            )

            this.p5.bezier(
                arrow.startVector.x, arrow.startVector.y,
                arrow.anchorOne.x, arrow.anchorOne.y,
                arrow.anchorTwo.x, arrow.anchorTwo.y,
                arrow.endVector.x, arrow.endVector.y
            )

        this.p5.pop()

    }

    public renderDraftStraightArrow() {
        const draftArrow = this.teacherController.straightArrowCreator.draftArrow
        if (draftArrow) {
            this.renderStraightArrow(draftArrow)
        }
    }

    public renderStraightArrow(arrow: StraightArrow) {
        this.p5.push()
        this.p5.stroke(0)
        this.p5.strokeWeight(ARROW_STROKE_WEIGHT)
        this.p5.line(arrow.startVector.x, arrow.startVector.y, arrow.endVector.x, arrow.endVector.y)
        this.p5.fill(0)
        this.p5.triangle(
            arrow.endVector.x,
            arrow.endVector.y,
            arrow.trianglePointOne.x,
            arrow.trianglePointOne.y,
            arrow.trianglePointTwo.x,
            arrow.trianglePointTwo.y,
        )
        this.p5.pop()
    }

    public decorateStraightArrowIfHovered() {
        const straightArrow =
            this.teacherController.hoverDetector.straightArrowCurrentlyHovered
        if (straightArrow != null && this.teacherController.pageState.eraserOn) {
            this.decorateStraightArrow(straightArrow, RED_OUTLINE_COLOR)
            this.showEraserTip()
        }

    }

    public decorateStraightArrow(arrow: StraightArrow, color: string) {

        this.p5.push()

            this.p5.noFill()
            this.p5.stroke(color)

            this.p5.strokeWeight(
                ARROW_STROKE_WEIGHT +
                OUTLINE_THICKNESS * 2
            )

            this.p5.line(arrow.startVector.x,
                         arrow.startVector.y,
                         arrow.endVector.x,
                         arrow.endVector.y
                         )

        this.p5.pop()

    }

}

export default TeacherView