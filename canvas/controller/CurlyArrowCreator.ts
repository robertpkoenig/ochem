import { IStudentState } from "../../pages/student/reactions/[reactionId]"
import { ITeacherState } from "../../pages/teacher/reactions/[reactionId]"
import { CurlyArrow } from "../model/chemistry/CurlyArrow"
import Reaction from "../model/Reaction"
import HoverDetector from "./teacher/helper/HoverDetector"
import ReactionSaver from "./teacher/helper/ReactionSaver"
import UndoManager from "./teacher/helper/UndoManager"

class CurlyArrowCreator {

    // upstream objects
	reaction: Reaction
    hoverDetector: HoverDetector
    undoManager: UndoManager
    pageState: ITeacherState | IStudentState

    // properties
    draftArrow: CurlyArrow

    constructor(
        reaction: Reaction,
        hoverDetecter: HoverDetector,
        pageState: ITeacherState | IStudentState,
        undoManager: UndoManager
    ) {
        this.reaction = reaction
        this.hoverDetector = hoverDetecter
        this.pageState = pageState
        this.undoManager = undoManager

        this.draftArrow = null

        // Undo manager is set from the editor controller because
        // that is where the undo manager is created
    }

    startArrowIfObjectClicked() {
       this.startArrowIfAtomClicked() 
       this.startArrowIfBondClicked() 
       this.startArrowIfLonePairClicked()
       this.startArrowIfIonClicked()
	}

    private startArrowIfAtomClicked() {
        const hoveredAtom = this.hoverDetector.atomCurrentlyHovered
        if (hoveredAtom != null) {
            const newArrow = new CurlyArrow (this.pageState.arrowType)
            newArrow.setStartObject(hoveredAtom)
            this.draftArrow = newArrow
        }
    }

    private startArrowIfBondClicked() {
        const hoveredBond = this.hoverDetector.bondCurrentlyHovered
        if (hoveredBond != null) {
            const newArrow = new CurlyArrow (this.pageState.arrowType)
            newArrow.setStartObject(hoveredBond)
            this.draftArrow = newArrow
        }
    }

    private startArrowIfLonePairClicked() {
      const hoveredLonePair = this.hoverDetector.lonePairCurrentlyHovered
      if (hoveredLonePair != null) {
        const newArrow = new CurlyArrow (this.pageState.arrowType)
        newArrow.setStartObject(hoveredLonePair)
        this.draftArrow = newArrow
      }
    }

    private startArrowIfIonClicked() {
      const hoveredIon = this.hoverDetector.ionCurrentlyHovered
      if (hoveredIon != null) {
        const newArrow = new CurlyArrow (this.pageState.arrowType)
        newArrow.setStartObject(hoveredIon)
        this.draftArrow = newArrow
      }
    }

    completeTeacherCurlyArrowIfReleasedOverObject() {
        this.completeArrowIfReleasedOverAtom()
        this.completeArrowIfReleasedOverBond()
        this.completeArrowIfReleasedOverLonePair()
        this.completeArrowIfReleasedOverIon()
        this.draftArrow = null
	}

    private completeArrowIfReleasedOverAtom() {

        const atomCurrentlyHovered = 
            this.hoverDetector.atomCurrentlyHovered

      if (atomCurrentlyHovered != null &&
              this.draftArrow.startObject != atomCurrentlyHovered
          ) {
              this.undoManager.addUndoPoint()
              this.draftArrow.setEndObject(atomCurrentlyHovered)
              this.reaction.currentStep.curlyArrows.push(this.draftArrow)
              ReactionSaver.saveReaction(this.reaction)
      }

    }

    private completeArrowIfReleasedOverBond() {

        const bondCurrentlyHovered = 
            this.hoverDetector.bondCurrentlyHovered

        if (bondCurrentlyHovered != null &&
                this.draftArrow.startObject != bondCurrentlyHovered
            ) {
                this.undoManager.addUndoPoint()
                this.draftArrow.setEndObject(bondCurrentlyHovered)
                this.reaction.currentStep.curlyArrows.push(this.draftArrow)
                ReactionSaver.saveReaction(this.reaction)
        }

    }

    private completeArrowIfReleasedOverLonePair() {
        const lonePairCurrentlyHovered = 
            this.hoverDetector.lonePairCurrentlyHovered
        if (lonePairCurrentlyHovered != null &&
                this.draftArrow.startObject != lonePairCurrentlyHovered
            ) {
                this.undoManager.addUndoPoint()
                this.draftArrow.setEndObject(lonePairCurrentlyHovered)
                this.reaction.currentStep.curlyArrows.push(this.draftArrow)
                ReactionSaver.saveReaction(this.reaction)
        }
    }

    private completeArrowIfReleasedOverIon() {
        const ionCurrentlyHovered = 
            this.hoverDetector.ionCurrentlyHovered
        if (ionCurrentlyHovered != null &&
                this.draftArrow.startObject != ionCurrentlyHovered
            ) {
                this.undoManager.addUndoPoint()
                this.draftArrow.setEndObject(ionCurrentlyHovered)
                this.reaction.currentStep.curlyArrows.push(this.draftArrow)
                ReactionSaver.saveReaction(this.reaction)
        }
    }

    completeStudentArrowIfReleasedOverObject() {
        this.completeStudentArrowIfReleasedOverAtom()
        this.completeStudentArrowIfReleasedOverBond()
	  }

    private completeStudentArrowIfReleasedOverAtom() {

        const atomCurrentlyHovered = 
            this.hoverDetector.atomCurrentlyHovered

		if (atomCurrentlyHovered != null &&
            this.draftArrow.startObject != atomCurrentlyHovered) {

            this.draftArrow.setEndObject(atomCurrentlyHovered)

		}

    }

    private completeStudentArrowIfReleasedOverBond() {

        const bondCurrentlyHovered = 
            this.hoverDetector.bondCurrentlyHovered

		if (bondCurrentlyHovered != null &&
            this.draftArrow.startObject != bondCurrentlyHovered) {

            this.draftArrow.setEndObject(bondCurrentlyHovered)

		}

    }

}

export default CurlyArrowCreator