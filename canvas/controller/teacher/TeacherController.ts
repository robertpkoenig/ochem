import Reaction from "../../model/Reaction"
import SingleAtomMoleculeCreator from "./helper/AtomCreator"
import BondCreator from "./helper/BondCreator"
import PanelController from "./helper/PanelController"
import { Vector } from "sat"
import CollisionDetector from "../../view/CollisinDetector"
import UndoManager from "./helper/UndoManager"
import HoverDetector from "./helper/HoverDetector"
import Eraser from "./helper/Eraser"
import CurlyArrowCreator from "../CurlyArrowCreator"
import p5 from "p5"
import { ITeacherState } from "../../../pages/teacher/reactions/[reactionId]"
import BodyMover from "../BodyMover"
import IonCreator from "./helper/IonCreator"
import StraightArrowCreator from "./helper/StraightArrowCreator"

class TeacherController {

    // upstream collaborating objects
    p5: p5
    reaction: Reaction
    collisionDetector: CollisionDetector
    hoverDetector: HoverDetector
    arrowCreator: CurlyArrowCreator
    bodyMover: BodyMover

	// downstream collaborating objects
	atomCreator: SingleAtomMoleculeCreator
	bondCreator: BondCreator
    panelController: PanelController
    undoManager: UndoManager
    eraser: Eraser
    ionCreator: IonCreator
    straightArrowCreator: StraightArrowCreator

    // React page state
    pageState: ITeacherState

    constructor(p5: p5,
                reaction: Reaction,
                collisionDetector: CollisionDetector,
                pageState: ITeacherState) {

        // Upstream collaborating objects
        this.p5 = p5
        this.reaction = reaction
        this.collisionDetector = collisionDetector

        // Downstream collaborating objects
        this.hoverDetector = new HoverDetector(reaction, collisionDetector)
        this.bodyMover = new BodyMover(p5, reaction)
		this.atomCreator = new SingleAtomMoleculeCreator(p5, reaction, this)
        this.bondCreator = new BondCreator(reaction, this)
		this.panelController = new PanelController(p5, reaction, this)
        this.undoManager = new UndoManager(this)
        this.arrowCreator = new CurlyArrowCreator(reaction, this.hoverDetector, pageState, this.undoManager)
        this.eraser = new Eraser(reaction, this)
        this.ionCreator = new IonCreator(reaction, this)
        this.straightArrowCreator = new StraightArrowCreator(reaction, this)

        // React page state
        this.pageState = pageState

    }

    process() {

        if (this.reaction.currentStep.curlyArrow) { // if there is a curly arrow present
            this.reaction.currentStep.curlyArrow.update(this.p5, this.reaction.zoom)
        }
        // TODO change this update function to sit with the arrowCreator
        if (this.arrowCreator.draftArrow != null) {
            this.arrowCreator.draftArrow.update(this.p5, this.reaction.zoom)
        }

        this.panelController.moveSelectedElementIfOneIsSelected()
        this.updateMouseStyle()
        
        if (this.straightArrowCreator.draftArrow) {
            this.straightArrowCreator.draftArrow.update(this.p5, this.reaction.zoom)
        }
      
        this.bodyMover.dragBodyIfPressed()
        this.hoverDetector.detectHovering()
    }

    routeMousePressed(mouseVector: Vector) {
        if (this.pageState.bondType != null) {
            this.bondCreator.startBondIfAtomClicked()
        }
        if (this.pageState.bondType == null &&
            this.pageState.arrowType == null) {
            this.bodyMover.startDraggingBodyIfPressed(mouseVector)
        }
        if (this.pageState.eraserOn) {
            this.eraser.eraseAnythingClicked()
        }
        if (this.pageState.selectedIon) {
            this.ionCreator.createIonIfAtomClicked(this.pageState.selectedIon)
        }
        if (this.pageState.straightArrowSelected) {
            this.straightArrowCreator.startArrow(mouseVector)
        }
        if (this.pageState.arrowType != null) {
            this.arrowCreator.startArrowIfObjectClicked()
        }
    }

    routeMouseReleased(mouseVector: Vector) {
        if (this.pageState.bondType != null) {
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
        this.bodyMover.stopDraggingBody()
    }

    updateMouseStyle() {

        const currentlyOverAtom = this.hoverDetector.atomCurrentlyHovered != null
        const currentlyOverBond = this.hoverDetector.bondCurrentlyHovered != null

        const currentlyDrawingBondOrArrowOrIonOrAngle = 
            this.bondCreator.startAtom != null ||
            this.arrowCreator.draftArrow != null ||
            this.pageState.selectedIon ||
            this.pageState.angleControlSelected

        if (currentlyDrawingBondOrArrowOrIonOrAngle) {
            this.p5.cursor("crosshair")
        }

        // Hovering atom and eraser off
        else if (currentlyOverAtom && !this.pageState.eraserOn) {

            // if a bond is currently being drawn, draw a cross hair
            if (this.pageState.bondType != null ||
                this.pageState.arrowType != null) {            
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
        else if (currentlyOverBond && this.pageState.arrowType != null) {
            this.p5.cursor("crosshair")
        }

        else {
            this.p5.cursor(this.p5.ARROW)
        }

    }

}

export default TeacherController