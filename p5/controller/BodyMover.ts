import p5 from "p5";
import SAT from "sat";
import Reaction from "../model/Reaction";
import { Body } from "../model/physics/Body";

class BodyMover {

	p5: p5
	reaction: Reaction
	atomBeingDragged: Body

	constructor(p5: p5, model: Reaction) {
		this.p5 = p5
		this.reaction = model
		this.atomBeingDragged = null
	}

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