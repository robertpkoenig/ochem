import Reaction from "../../model/Reaction"
import SingleAtomMoleculeCreator from "./AtomCreator"
import BondCreator from "./BondCreator"
import PanelController from "./PanelController"
import { Vector } from "sat"
import CollisionDetector from "../../model/physics/CollisinDetector"
import UndoManager from "./UndoManager"
import HoverDetector from "./HoverDetector"
import Eraser from "./Eraser"
import ArrowCreator from "../ArrowCreator"
import p5 from "p5"
import TeacherReactionPage from "../../../pages/teacher/reactions/[reactionId]"
import UserType from "../../model/UserType"
import BodyMover from "../BodyMover"

class TeacherController {

    // upstream collaborating objects
    p5: p5
    reaction: Reaction
    collisionDetector: CollisionDetector
    hoverDetector: HoverDetector
    arrowCreator: ArrowCreator
    bodyMover: BodyMover
    teacherReactionPage: TeacherReactionPage | null

    // properties
    userType: UserType

	// downstream collaborating objects
	atomCreator: SingleAtomMoleculeCreator
	bondCreator: BondCreator
    panelController: PanelController
    undoManager: UndoManager
    eraser: Eraser

    constructor(p5: p5,
                reaction: Reaction,
                collisionDetector: CollisionDetector,
                hoverDetector: HoverDetector,
                arrowCreator: ArrowCreator,
                bodyMover: BodyMover,
                teacherReactionPage: TeacherReactionPage,
                userType: UserType) {

        this.p5 = p5
        this.reaction = reaction
        this.collisionDetector = collisionDetector
        this.hoverDetector = hoverDetector
        this.arrowCreator = arrowCreator
        this.bodyMover = bodyMover
        this.teacherReactionPage = teacherReactionPage
        this.userType = userType

		this.atomCreator = new SingleAtomMoleculeCreator(p5, reaction, this)
        this.bondCreator = new BondCreator(reaction, this)
		this.panelController = new PanelController(p5, reaction, this)
        this.undoManager = new UndoManager(this)
        this.eraser = new Eraser(reaction, this)

        this.teacherReactionPage.setController(this)

    }

    process() {
        this.panelController.moveElementIfSelected()
        this.updateMouseStyle()
    }

    routeMousePressed(mouseVector: Vector) {
        if (this.teacherReactionPage.state.bondType != null) {
            this.bondCreator.startBondIfAtomClicked(mouseVector)
        }
        if (this.teacherReactionPage.state.bondType == null &&
            this.teacherReactionPage.state.arrowType == null) {
            this.bodyMover.startDraggingBodyIfPressed(mouseVector)
        }
        if (this.teacherReactionPage.state.eraserOn) {
            this.eraser.eraseAnythingClicked()
        }
    }

    routeMouseReleased(mouseVector: Vector) {
        if (this.teacherReactionPage.state.bondType != null) {
            this.bondCreator.completeBondIfReleasedOverAtom(mouseVector)
        }
        if (this.panelController.selectedElementId != null) {
            this.panelController.dropElement()  
        }
        if (this.arrowCreator.draftArrow != null) {
            this.arrowCreator.completeTeacherArrowIfReleasedOverObject()
        }
    }

    updateMouseStyle() {

        const currentlyOverAtom = this.hoverDetector.atomCurrentlyHovered != null
        const currentlyOverBond = this.hoverDetector.bondCurrentlyHovered != null

        const currentlyDrawingBondOrArrow = 
            this.bondCreator.startAtom != null ||
            this.arrowCreator.draftArrow != null

        if (currentlyDrawingBondOrArrow) {
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