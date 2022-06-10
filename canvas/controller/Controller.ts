import p5 from "p5"
import Reaction from "../model/Reaction"
import BodyMover from "./BodyMover"
import { Vector } from "sat"
import CollisionDetector from "../view/CollisinDetector"
import { IPageState } from "../../pages/teacher/reactions/[reactionId]"
import UserType from "../model/UserType"
import CurlyArrowCreator from "./CurlyArrowCreator"
import HoverDetector from "./teacher/helper/HoverDetector"
import StudentController from "./student/StudentController"
import TeacherController from "./teacher/TeacherController"

/** Handles user input in the canvas. */
class Controller {

    // upstream collaborating objects
    p5: p5
    reaction: Reaction
    collisionDetector: CollisionDetector

    // properties
    userType: UserType

    // downstream collaborating objects
    bodyMover: BodyMover
    hoverDetector: HoverDetector
    arrowCreator: CurlyArrowCreator
    teacherController: TeacherController
    studentController: StudentController

    // State held in the react page
    pageState: IPageState

    constructor(
        p5: p5,
        reaction: Reaction,
        collisionDetector: CollisionDetector,
        pageState: IPageState,
        userType: UserType) {

        this.p5 = p5
        this.reaction = reaction
        this.collisionDetector = collisionDetector
        this.pageState = pageState
        this.userType = userType

        this.hoverDetector = new HoverDetector(reaction, collisionDetector)
        this.arrowCreator = new CurlyArrowCreator(reaction, this.hoverDetector, pageState)

        this.bodyMover = new BodyMover(p5, reaction)

        if (userType == UserType.TEACHER) {
            this.teacherController =
                new TeacherController(
                    p5,
                    reaction,
                    collisionDetector,
                    this.hoverDetector,
                    this.arrowCreator,
                    this.bodyMover,
                    this.pageState
                )
            
            this.arrowCreator.undoManager = this.teacherController.undoManager
        }

        if (userType == UserType.STUDENT) {
            this.studentController = 
                new StudentController(
                    p5,
                    reaction,
                    collisionDetector,
                    this.hoverDetector,
                    this.arrowCreator,
                    this.bodyMover,
                    pageState)
        }

    }

    // Logic triggered each frame to update model
    process() {
        if (this.reaction.currentStep.curlyArrow) { // if there is a curly arrow present
            this.reaction.currentStep.curlyArrow.update(this.p5)
        }
        // TODO change this update function to sit with the arrowCreator
        if (this.arrowCreator.draftArrow != null) {
            this.arrowCreator.draftArrow.update(this.p5)
        }
        if (this.userType == UserType.TEACHER) {
            this.teacherController.process()
        }
        if (this.userType == UserType.STUDENT) {
            this.studentController.process()
        }
        this.bodyMover.dragBodyIfPressed()
        this.hoverDetector.detectHovering()
    }

    // Routes mouse press to different handlers based on program state
    routeMousePressed(mouseVector: Vector) {
        if (this.teacherController) {
            this.teacherController.routeMousePressed(mouseVector)
        }
        if (this.studentController) {
            this.studentController.routeMousePressed(mouseVector)
        }
        if (this.pageState.arrowType != null) {
            this.arrowCreator.startArrowIfObjectClicked()
        }
    }

    // Routes mouse release to different handlers based on program state
    routeMouseReleased(mouseVector: Vector) {
        if (this.teacherController) {
            this.teacherController.routeMouseReleased(mouseVector)
        }
        if (this.studentController) {
            this.studentController.routeMouseReleased(mouseVector)
        }
        this.bodyMover.stopDraggingBody()

    }

}

export { Controller }