import p5 from "p5"
import { Vector } from "sat"
import CollisionDetector from "../../view/CollisinDetector"
import Reaction from "../../model/Reaction"
import CurlyArrowCreator from "../CurlyArrowCreator"
import BodyMover from "../BodyMover"
import HoverDetector from "../teacher/helper/HoverDetector"
import { IStudentState } from "../../../pages/student/reactions/[reactionId]"

/** Handles student input in canvas */
class StudentController {

    // Upstream objects
    p5: p5
    reaction: Reaction
    collisionDetector: CollisionDetector
    hoverDetector: HoverDetector
    arrowCreator: CurlyArrowCreator
    bodyMover: BodyMover

    // React page state
    pageState: IStudentState

    // Functions from the react page that trigger notifications to user
    arrowDrawnCorrectly: () => void
    arrowDrawnIncorrectly: () => void

    constructor(
        p5: p5,
        reaction: Reaction,
        collisionDetector: CollisionDetector,
        pageState: IStudentState,
        arrowDrawnCorrectly: () => void,
        arrowDrawnIncorrectly: () => void,
    ) {
        this.p5 = p5
        this.reaction = reaction
        this.collisionDetector = collisionDetector
        this.pageState = pageState

        this.arrowDrawnCorrectly = arrowDrawnCorrectly
        this.arrowDrawnIncorrectly = arrowDrawnIncorrectly

        this.hoverDetector = new HoverDetector(reaction, collisionDetector)
        this.arrowCreator = new CurlyArrowCreator(reaction, this.hoverDetector, pageState, null) // no undo for student
    }

    process() {
        if (this.reaction.currentStep.curlyArrow) { // if there is a curly arrow present
            this.reaction.currentStep.curlyArrow.update(this.p5)
        }
        // TODO change this update function to sit with the arrowCreator
        if (this.arrowCreator.draftArrow != null) {
            this.arrowCreator.draftArrow.update(this.p5)
        }
        this.updateMouseStyle()
        this.hoverDetector.detectHovering()
    }

    routeMousePressed(mouseVector: Vector) {
        if (this.pageState.arrowType != null) {
            this.arrowCreator.startArrowIfObjectClicked()
        }
    }

    routeMouseReleased(mouseVector: Vector) {
        if (this.arrowCreator.draftArrow != null) {
            this.testStudentArrowIfCompleted()
        }
    }

    // Updates the mouse style based on what the mouse is hovering
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
            if (this.pageState.arrowType != null) {            
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

    /** Once the student draws their arrow, test that it is correct */
    testStudentArrowIfCompleted() {
        this.arrowCreator.completeStudentArrowIfReleasedOverObject()
        if (this.arrowCreator.draftArrow != null &&
            this.arrowCreator.draftArrow.startObject ===
                this.reaction.currentStep.curlyArrow.startObject &&
            this.arrowCreator.draftArrow.endObject ===
                this.reaction.currentStep.curlyArrow.endObject) {
                this.arrowDrawnCorrectly()
                this.arrowCreator.draftArrow = null
        }
        else if (this.arrowCreator.draftArrow != null &&
                 this.arrowCreator.draftArrow.endObject != null) {
            this.arrowDrawnIncorrectly()
            this.arrowCreator.draftArrow = null
        }
        this.arrowCreator.draftArrow = null
    }

}

export default StudentController