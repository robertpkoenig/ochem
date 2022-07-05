import p5 from "p5"
import { Vector } from "sat"
import CollisionDetector from "../../view/CollisinDetector"
import Reaction from "../../model/Reaction"
import CurlyArrowCreator from "../CurlyArrowCreator"
import BodyMover from "../BodyMover"
import HoverDetector from "../teacher/helper/HoverDetector"
import { IStudentState } from "../../../pages/student/reactions/[reactionId]"
import { addDelayedAction } from "../delayedActions"
import { addArrowToListOfCurlyArrows, clearCurlyArrows, curlyArrows, removeArrowFromCurlyArrows } from "../../view/curlyArrows"
import { addToFeedbackItems, CorrectArrowFeedback, IncorrectArrowFeedback, removeFromFeedbackItems } from "../../view/feedback"

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
    setPageState: React.Dispatch<React.SetStateAction<IStudentState>>

    constructor(
        p5: p5,
        reaction: Reaction,
        collisionDetector: CollisionDetector,
        pageState: IStudentState,
        setPageState: React.Dispatch<React.SetStateAction<IStudentState>>
    ) {
        this.p5 = p5
        this.reaction = reaction
        this.collisionDetector = collisionDetector
        this.pageState = pageState
        this.setPageState = setPageState

        this.hoverDetector = new HoverDetector(reaction, collisionDetector)
        this.arrowCreator = new CurlyArrowCreator(reaction, this.hoverDetector, pageState, null) // no undo for student
    }

    process() {
        for (const curlyArrow of this.reaction.currentStep.curlyArrows) { // if there is a curly arrow present
            curlyArrow.update(this.p5, this.reaction.zoom)
        }
        // TODO change this update function to sit with the arrowCreator
        if (this.arrowCreator.draftArrow != null) {
            this.arrowCreator.draftArrow.update(this.p5, this.reaction.zoom)
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
        const nextCurlyArrowIndex = curlyArrows.length
        const nextCurlyArrow = this.reaction.currentStep.curlyArrows[nextCurlyArrowIndex]
        this.arrowCreator.completeStudentArrowIfReleasedOverObject()
        if (this.arrowCreator.draftArrow != null) {
          const curlyArrowIsCorrect = 
            this.arrowCreator.draftArrow.startObject === nextCurlyArrow.startObject &&
            this.arrowCreator.draftArrow.endObject === nextCurlyArrow.endObject
          if (curlyArrowIsCorrect) {
            addArrowToListOfCurlyArrows(this.arrowCreator.draftArrow)
            const correctArrowFeedback = new CorrectArrowFeedback(this.arrowCreator.draftArrow, this.p5)
            addToFeedbackItems(correctArrowFeedback)
            addDelayedAction(() => {
              removeFromFeedbackItems(correctArrowFeedback)
              this.moveToNextStepIfReady()
            }, 2000)
          } else {
            const incorrectArrow = this.arrowCreator.draftArrow
            incorrectArrow.correct = false
            addArrowToListOfCurlyArrows(this.arrowCreator.draftArrow)
            const incorrectArrowFeedback = new IncorrectArrowFeedback(this.arrowCreator.draftArrow, this.p5)
            addToFeedbackItems(incorrectArrowFeedback)
            addDelayedAction(() => {
              removeFromFeedbackItems(incorrectArrowFeedback)
              removeArrowFromCurlyArrows(incorrectArrow)
            }, 1000)
          }
        }
        this.arrowCreator.draftArrow = null
        if (this.arrowCreator.draftArrow != null &&
            this.arrowCreator.draftArrow.startObject ===
                nextCurlyArrow.startObject &&
            this.arrowCreator.draftArrow.endObject ===
                nextCurlyArrow.endObject) 
        {

          addDelayedAction(() => console.log("delayedActiontriggered"), 1000)
        }
        else if (this.arrowCreator.draftArrow != null &&
                 this.arrowCreator.draftArrow.endObject != null) {
            // todo
            this.arrowCreator.draftArrow = null
        }
        this.arrowCreator.draftArrow = null
    }

    moveToNextStepIfReady() {
      if (curlyArrows.length == this.reaction.currentStep.curlyArrows.length) {
        clearCurlyArrows()
        const currentStepIndex = this.pageState.reaction.currentStep.order
        this.pageState.reaction.currentStep = this.pageState.reaction.steps[currentStepIndex + 1]
        this.setPageState({...this.pageState, numCorrectArrows: 0})
      } else {
        this.setPageState({...this.pageState, numCorrectArrows: this.pageState.numCorrectArrows + 1})
      }
    }

}

export default StudentController