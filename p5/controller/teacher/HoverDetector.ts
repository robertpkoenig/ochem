import { Atom } from "../../model/chemistry/atoms/Atom";
import { Bond } from "../../model/chemistry/bonds/Bond";
import Reaction from "../../model/Reaction";
import CollisionDetector from "../../model/physics/CollisinDetector";
import { CurlyArrow } from "../../model/chemistry/CurlyArrow";

class HoverDetector {

    atomCurrentlyHovered: Atom
    bondCurrentlyHovered: Bond
    reaction: Reaction
    collisionDetector: CollisionDetector
    arrowCurrentlyHovered: CurlyArrow;

    constructor(reaction: Reaction,
                collisionDetector: CollisionDetector) {

        this.reaction = reaction
        this.collisionDetector = collisionDetector

        this.atomCurrentlyHovered = null
        this.bondCurrentlyHovered = null
        this.arrowCurrentlyHovered = null

    }

    detectHovering() {

        this.detectAtomHover()
        // If an atom is hovered, don't detect a bond hover
        // because bonds go into the atom, and this would
        // result in both a bond and atom highlighted
        if (this.atomCurrentlyHovered) {
            this.bondCurrentlyHovered = null
        }
        else {
            this.detectBondHover()
        }

        if (this.bondCurrentlyHovered || this.atomCurrentlyHovered) {
            this.arrowCurrentlyHovered = null
        }

        else {
            this.detectArrowHover()
        }

    }

    private detectAtomHover() {
        for (const atom of this.reaction.currentStep.getAllAtoms()) {
            if (this.collisionDetector.mouseHoveredOverBody(atom)) {
                this.atomCurrentlyHovered = atom
                return
            }
        }
        this.atomCurrentlyHovered = null
    }

    private detectBondHover() {
        for (const bond of this.reaction.currentStep.getAllBonds()) {
            if (this.collisionDetector.mouseHoveredOverBond(bond)) {
                this.bondCurrentlyHovered = bond
                return
            }
        }
        this.bondCurrentlyHovered = null
    }

    private detectArrowHover() {        
        const arrow = this.reaction.currentStep.curlyArrow
        if (arrow != null && this.collisionDetector.mouseHoveredOverArrow(arrow)) {
            this.arrowCurrentlyHovered = arrow   
        }
        else {
            this.arrowCurrentlyHovered = null
        }
    }

}

export default HoverDetector