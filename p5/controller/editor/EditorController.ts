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

class EditorController {

    // upstream collaborating objects
    p5: p5
    reaction: Reaction
    collisionDetector: CollisionDetector

	// downstream collaborating objects
	atomCreator: SingleAtomMoleculeCreator
	bondCreator: BondCreator
    arrowCreator: ArrowCreator
panelController: PanelController
    undoManager: UndoManager
    hoverDetector: HoverDetector
    eraser: Eraser

    constructor(p5: p5, reaction: Reaction, collisionDetector: CollisionDetector) {

        this.p5 = p5
        this.reaction = reaction
        this.collisionDetector = collisionDetector

		this.atomCreator = new SingleAtomMoleculeCreator(p5, reaction, this)
		this.bondCreator = new BondCreator(reaction, this)
        this.arrowCreator = new ArrowCreator(reaction, this)
		this.panelController = new PanelController(p5, reaction, this)
        this.undoManager = new UndoManager(this)
        this.hoverDetector = new HoverDetector(reaction, this, collisionDetector)
        this.eraser = new Eraser(reaction, this)

		// attach the panel controller to the window so that it
		// can easily be accessed by DOM elements
		window.panelController = this.panelController

    }

    process() {
        this.panelController.moveElementIfSelected()
        this.updateMouseStyle()
        this.hoverDetector.detectHovering()
        if (this.arrowCreator.draftArrow != null) {
            this.arrowCreator.draftArrow.update()
        }
    }

    routeMousePressed(mouseVector: Vector) {
        if (this.panelController.bondType != null) {
            this.bondCreator.startBondIfAtomClicked(mouseVector)
        }
        if (this.panelController.eraserOn) {
            this.eraser.eraseAnythingClicked()
        }
        if (this.panelController.curlyArrowType != null) {
            this.arrowCreator.startArrowIfObjectClicked(mouseVector)
        }
    }

    routeMouseReleased(mouseVector: Vector) {
        if (this.panelController.bondType != null) {
            this.bondCreator.completeBondIfReleasedOverAtom(mouseVector)
        }
        if (this.arrowCreator.draftArrow != null) {
            this.arrowCreator.completeArrowIfReleasedOverObject()
        }
    }

    updateMouseStyle() {

        const currentlyOverAtom = this.hoverDetector.atomCurrentlyHovered != null
        const currentlyOverBond = this.hoverDetector.bondCurrentlyHovered != null

        if (this.bondCreator.startAtom != null ||
            this.arrowCreator.draftArrow != null) {
            this.p5.cursor("crosshair")
        }

        else if (currentlyOverAtom && !this.panelController.eraserOn) {
            // if a bond is currently being drawn, draw a cross hair
            if (this.panelController.bondType != null ||
                this.panelController.curlyArrowType != null) {            
                this.p5.cursor("crosshair")
            }

            else if (this.p5.mouseIsPressed) {
                this.p5.cursor("grabbing")
            }

            else {
                this.p5.cursor("grab")
            }
        }

        else if (currentlyOverBond && !this.panelController.eraserOn &&
                 this.panelController.curlyArrowType != null) {
            this.p5.cursor("crosshair")
        }

        else {
            this.p5.cursor(this.p5.ARROW)
        }

    }

}

export { EditorController }