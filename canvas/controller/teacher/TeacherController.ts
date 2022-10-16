import Reaction from "../../model/Reaction"
import SingleAtomMoleculeCreator from "./helper/AtomCreator"
import BondCreator from "./helper/BondCreator"
import PanelController from "./helper/PanelController"
import { Vector } from "sat"
import CollisionDetector from "../../view/CollisinDetector"
import UndoManager from "./helper/UndoManager"
import HoverDetector from "./helper/HoverDetector"
import Eraser from "./helper/Eraser"
import CurlyArrowCreator from "../CurlyArrowCreator"
import p5 from "p5"
import { ITeacherState } from "../../../pages/teacher/reactions/[reactionId]"
import AtomMover from "./helper/AtomMover"
import IonCreator from "./helper/IonCreator"
import StraightArrowCreator from "./helper/StraightArrowCreator"
import LonePairCreator from "./helper/LonePairCreator"
import moveLonePairIfPressed from "./helper/moveLonePair"
import ReactionSaver from "./helper/ReactionSaver"
import { moveIonIfPressed } from "./helper/moveIon"

class TeacherController {

    // upstream collaborating objects
    p5: p5
    reaction: Reaction
    collisionDetector: CollisionDetector
    hoverDetector: HoverDetector
    curlyArrowCreator: CurlyArrowCreator
    atomMover: AtomMover

    // downstream collaborating objects
    atomCreator: SingleAtomMoleculeCreator
    bondCreator: BondCreator
    panelController: PanelController
    undoManager: UndoManager
    eraser: Eraser
    ionCreator: IonCreator
    lonePairCreator: LonePairCreator
    straightArrowCreator: StraightArrowCreator

    // React page state
    pageState: ITeacherState

    constructor(p5: p5,
                reaction: Reaction,
                collisionDetector: CollisionDetector,
                pageState: ITeacherState) {

        // Upstream collaborating objects
        this.p5 = p5
        this.reaction = reaction
        this.collisionDetector = collisionDetector

        // Downstream collaborating objects
        this.hoverDetector = new HoverDetector(reaction, collisionDetector)
		    this.atomCreator = new SingleAtomMoleculeCreator(p5, reaction, this)
        this.bondCreator = new BondCreator(reaction, this)
		    this.panelController = new PanelController(p5, reaction, this)
        this.undoManager = new UndoManager(this)
        this.atomMover = new AtomMover(p5, reaction, this.hoverDetector, this.undoManager)
        this.curlyArrowCreator = new CurlyArrowCreator(reaction, this.hoverDetector, pageState, this.undoManager)
        this.eraser = new Eraser(reaction, this)
        this.ionCreator = new IonCreator(reaction, this)
        this.lonePairCreator = new LonePairCreator(reaction, this)
        this.straightArrowCreator = new StraightArrowCreator(reaction, this)

        // React page state
        this.pageState = pageState

    }

    process() {

        for (const curlyArrow of this.reaction.currentStep.curlyArrows) {
            curlyArrow.update(this.p5, this.reaction.zoom)
        }
        // TODO change this update function to sit with the arrowCreator
        if (this.curlyArrowCreator.draftArrow != null) {
            this.curlyArrowCreator.draftArrow.update(this.p5, this.reaction.zoom)
        }

        this.panelController.moveSelectedElementIfOneIsSelected()
        this.updateMouseStyle()
        
        if (this.straightArrowCreator.draftArrow) {
            this.straightArrowCreator.draftArrow.update(this.p5, this.reaction.zoom)
        }
      
        if (this.curlyArrowCreator.draftArrow === null) {
          this.atomMover.dragAllAtomsRequired()
          moveLonePairIfPressed(this.hoverDetector, this.p5)
          moveIonIfPressed(this.hoverDetector, this.p5)
        }
        this.hoverDetector.detectHovering()
    }

    routeMousePressed(mouseVector: Vector) {
        if (this.pageState.bondType != null) {
            this.bondCreator.startBondIfAtomClicked()
        }
        if (this.pageState.bondType == null &&
            this.pageState.arrowType == null) {
            this.atomMover.startDraggingBodyIfPressed()
        }
        if (this.pageState.eraserOn) {
            this.eraser.eraseAnythingClicked()
        }
        if (this.pageState.selectedIonType) {
            this.ionCreator.createIonIfAtomClicked(this.pageState.selectedIonType)
        }
        if (this.pageState.lonePairSelected) {
            this.lonePairCreator.createLonePairIfAtomClicked()
        }
        if (this.pageState.straightArrowSelected) {
            this.straightArrowCreator.startArrow(mouseVector)
        }
        if (this.pageState.arrowType != null) {
            this.curlyArrowCreator.startArrowIfObjectClicked()
        }
    }

    routeMouseReleased(mouseVector: Vector) {
        if (this.pageState.bondType != null) {
            this.bondCreator.completeBondIfReleasedOverAtom()
        }
        if (this.panelController.selectedElementId != null) {
            this.panelController.dropElement()  
        }
        if (this.curlyArrowCreator.draftArrow != null) {
            this.curlyArrowCreator.completeTeacherCurlyArrowIfReleasedOverObject()
        }
        if (this.straightArrowCreator.draftArrow) {
            this.straightArrowCreator.completeStraightArrow(mouseVector)
        }
        this.atomMover.stopDraggingBody()
        ReactionSaver.saveReaction(this.reaction)
    }

    updateMouseStyle() {

        const currentlyOverAtom = this.hoverDetector.atomCurrentlyHovered != null
        const currentlyOverBond = this.hoverDetector.bondCurrentlyHovered != null
        const currentlyOverLonePair = this.hoverDetector.lonePairCurrentlyHovered != null
        const currentlyOverIon = this.hoverDetector.ionCurrentlyHovered != null

        const currentlyDrawingBondOrArrowOrIonOrAngle = 
            this.bondCreator.startAtom != null ||
            this.curlyArrowCreator.draftArrow != null ||
            this.pageState.selectedIonType ||
            this.pageState.angleControlSelected

        const onlyMovingHandOrArrowIsActive = 
            (
              this.pageState.bondType == null &&
              this.pageState.eraserOn == false &&
              this.pageState.lonePairSelected == false &&
              this.pageState.selectedIonType == null &&
              this.pageState.straightArrowSelected == false &&
              this.pageState.arrowType == null
            )

        if (currentlyDrawingBondOrArrowOrIonOrAngle) {
            this.p5.cursor("crosshair")
        }

        // Hovering atom and eraser off
        else if (currentlyOverAtom && !this.pageState.eraserOn) {

            // if a bond is currently being drawn, draw a cross hair
            if (this.pageState.bondType != null ||
                this.pageState.arrowType != null) {            
                this.p5.cursor("crosshair")
            }

            else if (this.p5.mouseIsPressed) {
                this.p5.cursor("grabbing")
            }

            else {
                this.p5.cursor("grab")
            }
        }

        // Hovering a bond and arrow type is selected
        else if (currentlyOverBond && this.pageState.arrowType != null) {
            this.p5.cursor("crosshair")
        }

        else if (currentlyOverLonePair || currentlyOverIon) {
          if (this.pageState.arrowType !== null) this.p5.cursor("crosshair")
          else if (onlyMovingHandOrArrowIsActive) {
            if (this.p5.mouseIsPressed) this.p5.cursor("grabbing")
            else this.p5.cursor("grab")
          }
        }

        else {
            this.p5.cursor(this.p5.ARROW)
        }

    }

}

export default TeacherController