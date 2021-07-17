import p5 from "p5"
import Reaction from "../model/Reaction"
import BodyMover from "./BodyMover"
import { EditorController } from "./editor/EditorController"
import { Vector } from "sat"
import { IAtomicElement } from "../model/chemistry/atoms/elements"
import CollisionDetector from "../model/physics/CollisinDetector"

class Controller {

    // upstream collaborating objects
    p5: p5
    reaction: Reaction
    collisionDetector: CollisionDetector

    // downstream collaborating objects
    bodyMover: BodyMover
    editorController: EditorController

	// properties
	selectedElement: IAtomicElement

    constructor(p5: p5, reaction: Reaction, collisionDetector: CollisionDetector) {

        this.p5 = p5
        this.reaction = reaction
        this.collisionDetector = collisionDetector
        
        this.bodyMover = new BodyMover(p5, reaction)
        this.editorController = new EditorController(p5, reaction, collisionDetector)

    }

    process() {
        this.editorController.process()
        this.bodyMover.dragBodyIfPressed()
    }

    routeMousePressed(mouseVector: Vector) {
        this.editorController.routeMousePressed(mouseVector)
        if (this.editorController.panelController.bondType == null &&
            this.editorController.panelController.curlyArrowType == null) {
            this.bodyMover.startDraggingBodyIfPressed(mouseVector)
        }
    }

    routeMouseReleased(mouseVector: Vector) {
        this.editorController.routeMouseReleased(mouseVector)
        this.bodyMover.stopDraggingBody()
    }

}

export { Controller }