import p5 from "p5"
import Constants from "../Constants"
import BondType from "../model/chemistry/bonds/BondType"
import Reaction from "../model/Reaction"
import ReactionStep from "../model/ReactionStep"

class MoleculeViewer {

    p5: p5

    constructor(p5: p5) {
        this.p5 = p5
    }

    public render(reaction: Reaction) {
        const reactionStep = reaction.currentStep
        this.renderBonds(reactionStep)
        this.renderAtoms(reactionStep)
    }

    private renderAtoms(reactionStep: ReactionStep) {

        for (const atom of reactionStep.getAllAtoms()) {
            this.p5.push()
                this.p5.noStroke()
                this.p5.fill(atom.element.color)                
                this.p5.ellipse(atom.circle.pos.x, atom.circle.pos.y, atom.radius * 2)
                this.p5.fill("white")
                this.p5.text(atom.element.abbreviation, atom.circle.pos.x, atom.circle.pos.y + 2)
            this.p5.pop()
        }

    }

    private renderBonds(reactionStep: ReactionStep) {

        for (const bond of reactionStep.getAllBonds()) {

            this.p5.push()

                if (bond.type == null) {
                    continue
                }

                if (bond.type == BondType.SINGLE) {
                    this.p5.stroke(0)
                    this.p5.line(bond.atoms[0].circle.pos.x, bond.atoms[0].circle.pos.y,
                                 bond.atoms[1].circle.pos.x, bond.atoms[1].circle.pos.y)
 
                }

                if (bond.type == BondType.DOUBLE) {
                    this.p5.strokeWeight(Constants.STROKE_WEIGHT * 3)
                    this.p5.stroke(0)
                    this.p5.line(bond.atoms[0].circle.pos.x, bond.atoms[0].circle.pos.y,
                                 bond.atoms[1].circle.pos.x, bond.atoms[1].circle.pos.y)
                    this.p5.strokeWeight(Constants.STROKE_WEIGHT)
                    this.p5.stroke(255)
                    this.p5.line(bond.atoms[0].circle.pos.x, bond.atoms[0].circle.pos.y,
                                 bond.atoms[1].circle.pos.x, bond.atoms[1].circle.pos.y)
               }
       
            this.p5.pop()

        }

    }

}

export default MoleculeViewer