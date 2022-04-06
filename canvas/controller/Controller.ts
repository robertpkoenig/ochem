import p5 from "p5"
import Reaction from "../model/Reaction"
import BodyMover from "./BodyMover"

import { Vector } from "sat"
import CollisionDetector from "../view/CollisinDetector"
import TeacherReactionPage from "../../pages/teacher/reactions/[reactionId]"
import StudentReactionPage from "../../pages/student/reactions/[reactionId]"
import UserType from "../model/UserType"
import CurlyArrowCreator from "./CurlyArrowCreator"
import HoverDetector from "./teacher/HoverDetector"
import StudentController from "./student/StudentController"
import TeacherController from "./teacher/TeacherController"


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

    page: StudentReactionPage | TeacherReactionPage

    constructor(
        p5: p5,
        reaction: Reaction,
        collisionDetector: CollisionDetector,
        page: TeacherReactionPage | StudentReactionPage,
        userType: UserType) {

        this.p5 = p5
        this.reaction = reaction
        this.collisionDetector = collisionDetector
        this.page = page
        this.userType = userType

        this.hoverDetector = new HoverDetector(reaction, collisionDetector)
        this.arrowCreator = new CurlyArrowCreator(reaction, this.hoverDetector, page)

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
                    page as TeacherReactionPage,
                )
            
            this.arrowCreator.undoManager = this.teacherController.undoManager
        }

        if (userType == UserType.STUDENT) {
            this.studentController = 
                new StudentController(
                    p5,
                    reaction,
                    collisionDetector,
                    page as StudentReactionPage,
                    this.hoverDetector,
                    this.arrowCreator,
                    this.bodyMover)
        }

    }

    process() {
        if (this.reaction.currentStep.curlyArrow) {
            this.reaction.currentStep.curlyArrow.update(this.p5)
        }
        // I think I should change this update function to sit with the arrowCreator?
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

    routeMousePressed(mouseVector: Vector) {
        if (this.teacherController) {
            this.teacherController.routeMousePressed(mouseVector)
        }
        if (this.studentController) {
            this.studentController.routeMousePressed(mouseVector)
        }
        if (this.page.state.arrowType != null) {
            this.arrowCreator.startArrowIfObjectClicked()
        }
    }

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