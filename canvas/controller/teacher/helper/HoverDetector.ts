import { Atom } from "../../../model/chemistry/atoms/Atom";
import { Bond } from "../../../model/chemistry/bonds/Bond";
import Reaction from "../../../model/Reaction";
import CollisionDetector from "../../../view/CollisinDetector";
import { CurlyArrow } from "../../../model/chemistry/CurlyArrow";
import StraightArrow from "../../../model/chemistry/StraightArrow";
import LonePair from "../../../model/chemistry/atoms/LonePair";

/** Detects what item is hovered */
class HoverDetector {

    ionCurrentlyHovered: Atom
    lonePairCurrentlyHovered: LonePair
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

    /** 
     * The mouse can be over multiple objects at once.
     * The hover detector and the view implement a 'z-index' functionality to
     * create the illusion of objects being below or above others.
     */
    detectHovering() {

        this.detectIonHover()
        this.detectLonePairHover()

        // If it's already hovered over an ion, don't
        // say it's hovered over an atom
        if (this.ionCurrentlyHovered || this.lonePairCurrentlyHovered) {
            this.atomCurrentlyHovered = null
        }
        else {
            this.detectAtomHover()
        }

        // If an atom is hovered, don't detect a bond hover
        // because bonds go into the atom, and this would
        // result in both a bond and atom highlighted
        if (this.ionCurrentlyHovered|| this.lonePairCurrentlyHovered || this.atomCurrentlyHovered) {
            this.bondCurrentlyHovered = null
        }
        else {
            this.detectBondHover()
        }

        if (this.bondCurrentlyHovered || this.lonePairCurrentlyHovered || this.atomCurrentlyHovered
            || this.ionCurrentlyHovered) {
            this.curlyArrowCurrentlyHovered = null
        }

        else {
            this.detectCurlyArrowHover()
        }

        if (this.bondCurrentlyHovered|| this.lonePairCurrentlyHovered || this.atomCurrentlyHovered
            || this.ionCurrentlyHovered || this.curlyArrowCurrentlyHovered) {
            this.straightArrowCurrentlyHovered = null
        }

        else {
            this.detectStraightArrowHover()
        }

    }

    private detectIonHover() {
        for (const atom of this.reaction.currentStep.getAllAtoms()) {
            if (atom.ionSymbol) {
                if (this.collisionDetector.mouseHoveredOverIon(atom)) {
                    console.log("ion hovered");
                    
                    this.ionCurrentlyHovered = atom
                    return
                }
            }
        }
        this.ionCurrentlyHovered = null
    }

    private detectLonePairHover() {
      for (const atom of this.reaction.currentStep.getAllAtoms()) {
          if (atom.lonePair) {
              if (this.collisionDetector.mouseHoveredOverLonePair(atom.lonePair)) {
                  this.lonePairCurrentlyHovered = atom.lonePair
                  return
              }
          }
      }
      this.lonePairCurrentlyHovered = null
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
        let curlyArrowHovered = null    
        for (const curlyArrow of this.reaction.currentStep.curlyArrows) {
            if (this.collisionDetector.mouseHoveredOverArrow(curlyArrow)) {
                curlyArrowHovered = curlyArrow
            }
        }
        this.curlyArrowCurrentlyHovered = curlyArrowHovered
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