import p5 from "p5"
import Constants from "../Constants"
import BondType from "../model/chemistry/bonds/BondType"
import Reaction from "../model/Reaction"
import ArrowViewer from "./ArrowViewer"
import MoleculeViewer from "./MoleculeViewer"

class View {

    p5: p5
    reaction: Reaction

    constructor(p5: p5, reaction: Reaction) {
        this.p5 = p5
        this.reaction = reaction
        
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
        this.renderMolecules()
        this.renderArrow()
    }

    renderMolecules() {
        MoleculeViewer.render(this.reaction)
    }

    renderArrow() {
        const arrow = this.reaction.currentStep.curlyArrow
        if (arrow != null) {
            ArrowViewer.renderArrow(arrow)
        }
    }

    // drawArrowPolyPoints() {
    //     const arrow = this.reaction.currentStep.curlyArrow
    //     if (arrow != null) {
    //         for (const point of arrow.points) {
    //             this.p5.ellipse(point.x, point.y, 5)
    //         }
    //     }
    // }

}

export { View }