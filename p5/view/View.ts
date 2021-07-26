import p5 from "p5"
import { User } from "react-feather"
import Constants from "../Constants"
import { Controller } from "../controller/Controller"
import BondType from "../model/chemistry/bonds/BondType"
import Reaction from "../model/Reaction"
import UserType from "../model/UserType"
import ArrowViewer from "./ArrowViewer"
import TeacherView from "./EditorView"
import MoleculeViewer from "./MoleculeViewer"
import StudentView from "./StudentView"

class View {

    // Upstrea objects
    p5: p5
reaction: Reaction
    controller: Controller

    // Properties
    userType: UserType

    // Downstream objects
    teacherView: TeacherView
    studentView: StudentView
    moleculeViewer: MoleculeViewer
    arrowViewer: ArrowViewer

    constructor(p5: p5,
                reaction: Reaction,
                controller: Controller,
                userType: UserType) {

        this.p5 = p5
        this.reaction = reaction
        this.controller = controller
        this.userType = userType

        if (userType == UserType.TEACHER) {
            this.teacherView = new TeacherView( p5,
                                              reaction,
                                              controller.teacherController, 
                                              controller.collisionDetector)

        }
        if (userType == UserType.STUDENT) {
            this.studentView = new StudentView( p5,
                                                controller)

        }
        this.moleculeViewer = new MoleculeViewer(p5)
        this.arrowViewer = new ArrowViewer(p5)
        
        // this.loadFont()
        this.setupDrawingParams()
    }

    setupDrawingParams() {
        this.p5.rectMode(this.p5.CENTER)
        this.p5.textAlign(this.p5.CENTER, this.p5.CENTER)
        this.p5.textSize(17)
        this.p5.imageMode(this.p5.CENTER)
        this.p5.strokeWeight(Constants.STROKE_WEIGHT)
        this.p5.frameRate(30)
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
        this.renderArrow()
        this.renderDraftArrow()
    }

    renderMolecules() {
        this.moleculeViewer.render(this.reaction)
    }

    renderArrow() {
        if (this.userType == UserType.TEACHER) {
            const arrow = this.reaction.currentStep.curlyArrow
            if (arrow != null) {
                this.arrowViewer.renderArrow(arrow)
            }
        }
    }

    renderDraftArrow() {
        const draftArrow = 
            this.controller.arrowCreator.draftArrow
        if (draftArrow != null) {
            this.arrowViewer.renderArrow(draftArrow)
        }
    }

}

export { View }