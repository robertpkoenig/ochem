import Reaction from "../../model/Reaction"
import SingleAtomMoleculeCreator from "./AtomCreator"
import BondCreator from "./BondCreator"
import PanelController from "./PanelController"
import { Vector } from "sat"
import CollisionDetector from "../../view/CollisinDetector"
import UndoManager from "./UndoManager"
import HoverDetector from "./HoverDetector"
import Eraser from "./Eraser"
import CurlyArrowCreator from "../CurlyArrowCreator"
import p5 from "p5"
import TeacherReactionPage from "../../../pages/teacher/reactions/[reactionId]"
import UserType from "../../model/UserType"
import BodyMover from "../BodyMover"
import IonCreator from "./IonCreator"
import StraightArrowCreator from "./StraightArrowCreator"

class TeacherController {

    // upstream collaborating objects
    p5: p5
    reaction: Reaction
    collisionDetector: CollisionDetector
    hoverDetector: HoverDetector
    arrowCreator: CurlyArrowCreator
    bodyMover: BodyMover
    teacherReactionPage: TeacherReactionPage | null

	// downstream collaborating objects
	atomCreator: SingleAtomMoleculeCreator
	bondCreator: BondCreator
    panelController: PanelController
    undoManager: UndoManager
    eraser: Eraser
    ionCreator: IonCreator
    straightArrowCreator: StraightArrowCreator

    constructor(p5: p5,
                reaction: Reaction,
                collisionDetector: CollisionDetector,
                hoverDetector: HoverDetector,
                arrowCreator: CurlyArrowCreator,
                bodyMover: BodyMover,
                teacherReactionPage: TeacherReactionPage) {

        // Upstream collaborating objects
        this.p5 = p5
        this.reaction = reaction
        this.collisionDetector = collisionDetector
        this.hoverDetector = hoverDetector
        this.arrowCreator = arrowCreator
        this.bodyMover = bodyMover
        this.teacherReactionPage = teacherReactionPage

        // Downstream collaborating objects
		this.atomCreator = new SingleAtomMoleculeCreator(p5, reaction, this)
        this.bondCreator = new BondCreator(reaction, this)
		this.panelController = new PanelController(p5, reaction, this)
        this.undoManager = new UndoManager(this)
        this.eraser = new Eraser(reaction, this)
        this.ionCreator = new IonCreator(reaction, this)
        this.straightArrowCreator = new StraightArrowCreator(reaction, this)
        
        this.teacherReactionPage.setController(this)

    }

    process() {
        this.panelController.moveElementIfSelected()
        this.updateMouseStyle()
        if (this.straightArrowCreator.draftArrow) {
            this.straightArrowCreator.draftArrow.update(this.p5)
        }
    }

    routeMousePressed(mouseVector: Vector) {
        if (this.teacherReactionPage.state.bondType != null) {
            this.bondCreator.startBondIfAtomClicked()
        }
        if (this.teacherReactionPage.state.bondType == null &&
            this.teacherReactionPage.state.arrowType == null) {
            this.bodyMover.startDraggingBodyIfPressed(mouseVector)
        }
        if (this.teacherReactionPage.state.eraserOn) {
            this.eraser.eraseAnythingClicked()
        }
        if (this.teacherReactionPage.state.selectedIon) {
            this.ionCreator.createIonIfAtomClicked(this.teacherReactionPage.state.selectedIon)
        }
        if (this.teacherReactionPage.state.straightArrowSelected) {
            this.straightArrowCreator.startArrow(mouseVector)
        }
    }

    routeMouseReleased(mouseVector: Vector) {
        if (this.teacherReactionPage.state.bondType != null) {
            this.bondCreator.completeBondIfReleasedOverAtom()
        }
        if (this.panelController.selectedElementId != null) {
            this.panelController.dropElement()  
        }
        if (this.arrowCreator.draftArrow != null) {
            this.arrowCreator.completeTeacherArrowIfReleasedOverObject()
        }
        if (this.straightArrowCreator.draftArrow) {
            this.straightArrowCreator.completeArrow(mouseVector)
        }
    }

    updateMouseStyle() {

        const currentlyOverAtom = this.hoverDetector.atomCurrentlyHovered != null
        const currentlyOverBond = this.hoverDetector.bondCurrentlyHovered != null

        const currentlyDrawingBondOrArrowOrIonOrAngle = 
            this.bondCreator.startAtom != null ||
            this.arrowCreator.draftArrow != null ||
            this.teacherReactionPage.state.selectedIon ||
            this.teacherReactionPage.state.angleControlSelected

        if (currentlyDrawingBondOrArrowOrIonOrAngle) {
            this.p5.cursor("crosshair")
        }

        // Hovering atom and eraser off
        else if (currentlyOverAtom && !this.teacherReactionPage.state.eraserOn) {

            // if a bond is currently being drawn, draw a cross hair
            if (this.teacherReactionPage.state.bondType != null ||
                this.teacherReactionPage.state.arrowType != null) {            
                this.p5.cursor("crosshair")
            }

            else if (this.p5.mouseIsPressed) {
                this.p5.cursor("grabbing")
            }

            else {
                this.p5.cursor("grab")
            }
        }

        // Hovering a bond and arrow type is selected
        else if (currentlyOverBond && this.teacherReactionPage.state.arrowType != null) {
            this.p5.cursor("crosshair")
        }

        else {
            this.p5.cursor(this.p5.ARROW)
        }

    }

}

export default TeacherController