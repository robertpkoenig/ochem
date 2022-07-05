import p5 from "p5"
import Reaction from "../model/Reaction"
import UserType from "../model/UserType"
import CurlyArrowViewer from "./CurlyArrowViewer"
import TeacherView from "./TeacherView"
import MoleculeViewer from "./MoleculeViewer"
import StudentView from "./StudentView"
import { ARROW_STROKE_WEIGHT, FRAME_RATE, STROKE_WEIGHT } from "../Constants"
import TeacherController from "../controller/teacher/TeacherController"
import StudentController from "../controller/student/StudentController"

class View {

    // Upstrea objects
    p5: p5
    reaction: Reaction
    controller: TeacherController | StudentController

    // Properties
    userType: UserType

    // Downstream objects
    teacherView: TeacherView
    studentView: StudentView
    moleculeViewer: MoleculeViewer
    curlyArrowViewer: CurlyArrowViewer

    constructor(p5: p5,
                reaction: Reaction,
                controller: TeacherController | StudentController,
                userType: UserType) {

        this.p5 = p5
        this.reaction = reaction
        this.controller = controller
        this.userType = userType

        this.moleculeViewer = new MoleculeViewer(p5)
        this.curlyArrowViewer = new CurlyArrowViewer(p5)

        if (userType == UserType.TEACHER) {
            this.teacherView = new TeacherView( p5,
                                              reaction,
                                              controller as TeacherController, 
                                              controller.collisionDetector)

        }
        if (userType == UserType.STUDENT) {
            this.studentView = new StudentView( p5, controller as StudentController, this.curlyArrowViewer)

        }
        
        // this.loadFont()
        this.setupDrawingParams()
    }

    setupDrawingParams() {
        this.p5.rectMode(this.p5.CENTER)
        this.p5.textAlign(this.p5.CENTER, this.p5.CENTER)
        this.p5.textSize(17)
        this.p5.imageMode(this.p5.CENTER)
        this.p5.strokeWeight(STROKE_WEIGHT)
        this.p5.frameRate(FRAME_RATE)
        this.p5.textFont("Poppins")
    }

    render() {
        
        if (this.userType == UserType.TEACHER) {
            this.teacherView.render()
        }

        if (this.userType == UserType.STUDENT) {
            this.studentView.render()
        }

        this.renderMolecules()
        this.renderCurlyArrows()
        this.renderDraftCurlyArrow()
        this.renderStraightArrow()
    }

    renderMolecules() {
        this.moleculeViewer.render(this.reaction)
    }

    renderCurlyArrows() {
        if (this.userType == UserType.TEACHER) {
            const curlyArrows = this.reaction.currentStep.curlyArrows
            const showIndex = curlyArrows.length > 1
            for (let index = 0; index < curlyArrows.length; index++) {
                const arrow = curlyArrows[index];
                this.curlyArrowViewer.renderCurlyArrow(arrow, index, showIndex)
            }
        }
    }

    renderDraftCurlyArrow() {
        const draftArrow = 
            this.controller.arrowCreator.draftArrow
        const index = this.reaction.currentStep.curlyArrows.length
        const showIndex = index > 1 && this.userType == UserType.TEACHER
        if (draftArrow != null) {
            this.curlyArrowViewer.renderCurlyArrow(draftArrow, index, showIndex)
        }
    }

    renderStraightArrow() {
        const straightArrow =
            this.reaction.currentStep.straightArrow
        if (straightArrow) {
            this.p5.push()
            this.p5.stroke(0)
            this.p5.strokeWeight(ARROW_STROKE_WEIGHT)
                this.p5.line(
                    straightArrow.startVector.x,
                    straightArrow.startVector.y,
                    straightArrow.endVector.x,
                    straightArrow.endVector.y,
                )
                this.p5.fill(0)
                this.p5.triangle(
                    straightArrow.endVector.x,
                    straightArrow.endVector.y,
                    straightArrow.trianglePointOne.x,
                    straightArrow.trianglePointOne.y,
                    straightArrow.trianglePointTwo.x,
                    straightArrow.trianglePointTwo.y,
                )
            this.p5.pop()  
        }
    }

}

export { View }