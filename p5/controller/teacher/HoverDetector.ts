import { Atom } from "../../model/chemistry/atoms/Atom";
import { Bond } from "../../model/chemistry/bonds/Bond";
import Reaction from "../../model/Reaction";
import CollisionDetector from "../../model/physics/CollisinDetector";
import { CurlyArrow } from "../../model/chemistry/CurlyArrow";
import StraightArrow from "../../model/chemistry/StraightArrow";

class HoverDetector {

    ionCurrentlyHovered: Atom
    atomCurrentlyHovered: Atom
    bondCurrentlyHovered: Bond
    reaction: Reaction
    collisionDetector: CollisionDetector
    curlyArrowCurrentlyHovered: CurlyArrow;
    straightArrowCurrentlyHovered: StraightArrow

    constructor(reaction: Reaction,
                collisionDetector: CollisionDetector) {

        this.reaction = reaction
        this.collisionDetector = collisionDetector

        this.ionCurrentlyHovered = null
        this.atomCurrentlyHovered = null
        this.bondCurrentlyHovered = null
        this.curlyArrowCurrentlyHovered = null
        this.straightArrowCurrentlyHovered = null

    }

    detectHovering() {

        this.detectIonHover()

        // If it's already hovered over an ion, don't
        // say it's hovered over an atom
        if (this.ionCurrentlyHovered) {
            this.atomCurrentlyHovered = null
        }
        else {
            this.detectAtomHover()
        }

        // If an atom is hovered, don't detect a bond hover
        // because bonds go into the atom, and this would
        // result in both a bond and atom highlighted
        if (this.ionCurrentlyHovered || this.atomCurrentlyHovered) {
            this.bondCurrentlyHovered = null
        }
        else {
            this.detectBondHover()
        }

        if (this.bondCurrentlyHovered || this.atomCurrentlyHovered
            || this.ionCurrentlyHovered) {
            this.curlyArrowCurrentlyHovered = null
        }

        else {
            this.detectCurlyArrowHover()
        }

        if (this.bondCurrentlyHovered || this.atomCurrentlyHovered
            || this.ionCurrentlyHovered || this.curlyArrowCurrentlyHovered) {
            this.straightArrowCurrentlyHovered = null
        }

        else {
            this.detectStraightArrowHover()
        }

    }

    private detectIonHover() {
        for (const atom of this.reaction.currentStep.getAllAtoms()) {
            if (atom.ion) {
                if (this.collisionDetector.mouseHoveredOverIon(atom)) {
                    this.ionCurrentlyHovered = atom
                    return
                }
            }
        }
        this.ionCurrentlyHovered = null
    }

    private detectAtomHover() {
        for (const atom of this.reaction.currentStep.getAllAtoms()) {
            if (atom.element.name == "dummy") continue
            if (this.collisionDetector.mouseHoveredOverAtom(atom)) {
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

    private detectCurlyArrowHover() {        
        const arrow = this.reaction.currentStep.curlyArrow
        if (arrow != null && this.collisionDetector.mouseHoveredOverArrow(arrow)) {
            this.curlyArrowCurrentlyHovered = arrow   
        }
        else {
            this.curlyArrowCurrentlyHovered = null
        }
    }

    detectStraightArrowHover() {
        const arrow = this.reaction.currentStep.straightArrow
        if (arrow != null && this.collisionDetector.mouseHoveredOverStraightArrow(arrow)) {
            this.straightArrowCurrentlyHovered = arrow
        }
        else {
            this.straightArrowCurrentlyHovered = null
        }
    }

}

export default HoverDetector