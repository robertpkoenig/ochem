import Constants from "../Constants";
import TeacherController from "../controller/teacher/TeacherController";
import { Atom } from "../model/chemistry/atoms/Atom";
import { Bond } from "../model/chemistry/bonds/Bond";
import BondType from "../model/chemistry/bonds/BondType";
import Reaction from "../model/Reaction";
import CollisionDetector from "../model/physics/CollisinDetector";
import p5 from "p5";
import { CurlyArrow } from "../model/chemistry/CurlyArrow";

class TeacherView {

    p5: p5
    reaction: Reaction
    editorController: TeacherController
    collisionDetector: CollisionDetector

    panelCenterX: number
    panelCenterY: number

    eraserTipVisible: boolean

    constructor(p5: p5,
                reaction: Reaction,
                editorController: TeacherController,
                collisionDetector: CollisionDetector) 
    {
        this.p5 = p5
        this.reaction = reaction
        this.editorController = editorController
        this.collisionDetector = collisionDetector
        this.setParams()

        this.eraserTipVisible = false
    }

    setParams() {
        this.panelCenterX = Constants.EDITOR_MARGIN + Constants.EDITOR_PANEL_WIDTH / 2
        this.panelCenterY = window.innerHeight / 2 
    }

    render() {

        this.decorateAtomIfHovered()
        this.decorateBondIfHovered()
        this.decorateArrowIfHovered()

        this.renderDraftBond()

    }

    decorateAtomIfHovered() {
    
        const hoveredAtom = this.editorController.hoverDetector.atomCurrentlyHovered

        if (hoveredAtom != null) {

            if (this.editorController.teacherReactionPage.state.eraserOn) {
                this.drawAtomOutline(hoveredAtom, Constants.RED_OUTLINE_COLOR)
                this.showEraserTip()
            }
            else {
                this.drawAtomOutline(hoveredAtom, Constants.BLUE_OUTLINE_COLOR)
            }

        }

        else if (this.eraserTipVisible) {
            this.hideEraserTip()
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

    showEraserTip() {
        const eraserTip = this.p5.select("#eraser-tip")
        eraserTip.style("display", "inline")
        const boundingRect = this.editorController.panelController.canvasParent.getBoundingClientRect()
        const x = this.p5.mouseX + boundingRect.x + 10
        const y = this.p5.mouseY + boundingRect.y + 10
        eraserTip.position(x, y)

        this.eraserTipVisible = true
    }

    hideEraserTip() {
        const eraserTip = this.p5.select("#eraser-tip")
        eraserTip.style("display", "none")

        this.eraserTipVisible = false
    }

    decorateBondIfHovered() {

        const hoveredBond = this.editorController.hoverDetector.bondCurrentlyHovered

        if (hoveredBond != null) {
            if (this.editorController.teacherReactionPage.state.eraserOn) {
                this.drawBondOutline(hoveredBond, Constants.RED_OUTLINE_COLOR)
                this.showEraserTip()
                this.eraserTipVisible = true
            }
            if (this.editorController.teacherReactionPage.state.arrowType != null) {
                this.drawBondOutline(hoveredBond, Constants.BLUE_OUTLINE_COLOR)
            }
        }

    }

    drawBondOutline(bond: Bond, color: string) {

        this.p5.push()

            if (bond.type == BondType.SINGLE) {
            this.p5.stroke(0)
            this.p5.stroke(color)
            this.p5.strokeWeight(Constants.STROKE_WEIGHT + Constants.OUTLINE_THICKNESS * 2)
            this.p5.line(bond.atoms[0].circle.pos.x,
                bond.atoms[0].circle.pos.y,
                bond.atoms[1].circle.pos.x,
                bond.atoms[1].circle.pos.y)

            }

            if (bond.type == BondType.DOUBLE) {
                this.p5.strokeWeight(Constants.STROKE_WEIGHT * 3 + Constants.OUTLINE_THICKNESS * 2)
                this.p5.stroke(0)
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

    renderDraftBond() {
        
        if (this.editorController.bondCreator.startAtom != null) {
            
            this.p5.push()

                this.p5.fill(0)

                if (this.editorController.teacherReactionPage.state.bondType == BondType.SINGLE) {
                this.p5.stroke(0)
                this.p5.line(this.editorController.bondCreator.startAtom.circle.pos.x,
                    this.editorController.bondCreator.startAtom.circle.pos.y,
                    this.p5.mouseX,
                    this.p5.mouseY)
                }

                if (this.editorController.teacherReactionPage.state.bondType == BondType.DOUBLE) {
                    this.p5.strokeWeight(Constants.STROKE_WEIGHT * 3)
                    this.p5.stroke(0)
                    this.p5.line(this.editorController.bondCreator.startAtom.circle.pos.x,
                        this.editorController.bondCreator.startAtom.circle.pos.y,
                        this.p5.mouseX,
                        this.p5.mouseY)
                    this.p5.strokeWeight(Constants.STROKE_WEIGHT)
                    this.p5.stroke(255)
                    this.p5.line(this.editorController.bondCreator.startAtom.circle.pos.x,
                        this.editorController.bondCreator.startAtom.circle.pos.y,
                        this.p5.mouseX,
                        this.p5.mouseY)
                }
                
            this.p5.pop()

        }
        
    }

    decorateArrowIfHovered() {

        const arrow = this.editorController.hoverDetector.arrowCurrentlyHovered
        
        if (arrow != null && this.editorController.teacherReactionPage.state.eraserOn) {
            this.drawArrowOutline(arrow, Constants.RED_OUTLINE_COLOR)
        }

    }

    drawArrowOutline(arrow: CurlyArrow, color: string) {

        this.p5.push()

            this.p5.noFill()
            this.p5.stroke(color)

            this.p5.strokeWeight(
                Constants.ARROW_STROKE_WEIGHT +
                Constants.OUTLINE_THICKNESS * 2
            )

            this.p5.bezier(
                arrow.startVector.x, arrow.startVector.y,
                arrow.anchorOne.x, arrow.anchorOne.y,
                arrow.anchorTwo.x, arrow.anchorTwo.y,
                arrow.endVector.x, arrow.endVector.y
            )

        this.p5.pop()

    }

}

export default TeacherView