import Constants from "../Constants"
import BondType from "../model/chemistry/bonds/BondType"
import Reaction from "../model/Reaction"
import ReactionStep from "../model/ReactionStep"

class MoleculeViewer {

    public static render(reaction: Reaction) {
        const reactionStep = reaction.currentStep
        this.renderBonds(reactionStep)
        this.renderAtoms(reactionStep)
    }

    private static renderAtoms(reactionStep: ReactionStep) {

        for (const atom of reactionStep.getAllAtoms()) {
            window.p5.push()
                window.p5.noStroke()
                window.p5.fill(atom.element.color)                
                window.p5.ellipse(atom.circle.pos.x, atom.circle.pos.y, atom.radius * 2)
                window.p5.fill("white")
                window.p5.text(atom.element.abbreviation, atom.circle.pos.x, atom.circle.pos.y + 2)
            window.p5.pop()
        }

    }

    private static renderBonds(reactionStep: ReactionStep) {

        for (const bond of reactionStep.getAllBonds()) {

            window.p5.push()

                if (bond.type == null) {
                    continue
                }

                if (bond.type == BondType.SINGLE) {
                    window.p5.stroke(0)
                    window.p5.line(bond.atoms[0].circle.pos.x, bond.atoms[0].circle.pos.y,
                                 bond.atoms[1].circle.pos.x, bond.atoms[1].circle.pos.y)
 
                }

                if (bond.type == BondType.DOUBLE) {
                    window.p5.strokeWeight(Constants.STROKE_WEIGHT * 3)
                    window.p5.stroke(0)
                    window.p5.line(bond.atoms[0].circle.pos.x, bond.atoms[0].circle.pos.y,
                                 bond.atoms[1].circle.pos.x, bond.atoms[1].circle.pos.y)
                    window.p5.strokeWeight(Constants.STROKE_WEIGHT)
                    window.p5.stroke(255)
                    window.p5.line(bond.atoms[0].circle.pos.x, bond.atoms[0].circle.pos.y,
                                 bond.atoms[1].circle.pos.x, bond.atoms[1].circle.pos.y)
               }
       
            window.p5.pop()

        }

    }

}

export default MoleculeViewer