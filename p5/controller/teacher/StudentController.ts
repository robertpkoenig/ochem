import p5 from "p5"
import { Vector } from "sat"
import StudentReactionPage from "../../../pages/student/reactions/[reactionId]"
import CollisionDetector from "../../model/physics/CollisinDetector"
import Reaction from "../../model/Reaction"
import ArrowCreator from "../ArrowCreator"
import BodyMover from "../BodyMover"
import HoverDetector from "./HoverDetector"

class StudentController {

    // Upstream objects
    p5: p5
    reaction: Reaction
    collisionDetector: CollisionDetector
    studentReactionPage: StudentReactionPage
    hoverDetector: HoverDetector
    arrowCreator: ArrowCreator
    bodyMover: BodyMover

    constructor(
        p5: p5,
        reaction: Reaction,
        collisionDetector: CollisionDetector,
        studentReactionPage: StudentReactionPage,
        hoverDetector: HoverDetector,
        arrowCreator: ArrowCreator,
        bodyMover: BodyMover
    ) {
        this.p5 = p5
        this.reaction = reaction
        this.collisionDetector = collisionDetector
        this.studentReactionPage = studentReactionPage
        this.hoverDetector = hoverDetector
        this.arrowCreator = arrowCreator
        this.bodyMover = bodyMover
    }

    process() {
        this.updateMouseStyle()
    }

    routeMousePressed(mouseVector: Vector) {
        if (this.studentReactionPage.state.arrowType == null) {
            this.bodyMover.startDraggingBodyIfPressed(mouseVector)
        }
    }

    routeMouseReleased(mouseVector: Vector) {
        if (this.arrowCreator.draftArrow != null) {
            this.testStudentArrowIfCompleted()
        }
    }

    updateMouseStyle() {

        const currentlyOverAtom = this.hoverDetector.atomCurrentlyHovered != null
        const currentlyOverBond = this.hoverDetector.bondCurrentlyHovered != null

        const currentlyDrawingArrow = 
            this.arrowCreator.draftArrow != null

        if (currentlyDrawingArrow) {
            this.p5.cursor("crosshair")
        }

        // Hovering atom and eraser off
        else if (currentlyOverAtom) {
            
            // if a bond is currently being drawn, draw a cross hair
            if (this.studentReactionPage.state.arrowType != null) {            
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
        else if (currentlyOverBond && this.studentReactionPage.state.arrowType != null) {
            this.p5.cursor("crosshair")
        }

        else {
            this.p5.cursor(this.p5.ARROW)
        }

    }

    testStudentArrowIfCompleted() {
        this.arrowCreator.completeStudentArrowIfReleasedOverObject()
        if (this.arrowCreator.draftArrow != null &&
            this.arrowCreator.draftArrow.startObject ===
                this.reaction.currentStep.curlyArrow.startObject &&
            this.arrowCreator.draftArrow.endObject ===
                this.reaction.currentStep.curlyArrow.endObject) {
                this.studentReactionPage.arrowDrawnSuccesfully()
                this.arrowCreator.draftArrow = null
        }
        else if (this.arrowCreator.draftArrow != null &&
                 this.arrowCreator.draftArrow.endObject != null) {
            this.studentReactionPage.arrowDrawnWrong()
        }
        this.arrowCreator.draftArrow = null
    }

}

export default StudentController