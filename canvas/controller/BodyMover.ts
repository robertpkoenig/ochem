import p5 from "p5";
import SAT from "sat";
import { Atom } from "../model/chemistry/atoms/Atom";
import Reaction from "../model/Reaction";

/** Logic to move atoms or other objects in canvas */
class BodyMover {

	p5: p5
	reaction: Reaction
	atomBeingDragged: Atom

	constructor(p5: p5, reaction: Reaction) {
		this.p5 = p5
		this.reaction = reaction
		this.atomBeingDragged = null
	}

    // Replace this logic to just use the currently hovered atom
    // this is redundant with that logic
	startDraggingBodyIfPressed(mouseVector: SAT.Vector) {
        for (const body of this.reaction.currentStep.getAllAtoms()) {
            if (SAT.pointInCircle(mouseVector, body.circle)) {
                this.atomBeingDragged = body
                break
            }
        }
    }

	stopDraggingBody() {
		this.atomBeingDragged = null
	}

	dragBodyIfPressed() {
        if (this.atomBeingDragged != null) {
            // console.log("pos: ", this.atomBeingDragged.pos.x);
            
            this.atomBeingDragged.circle.pos.x = this.p5.mouseX
            this.atomBeingDragged.circle.pos.y = this.p5.mouseY
		}
    }
	
}

export default BodyMover