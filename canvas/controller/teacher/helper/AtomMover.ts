import p5 from "p5";
import { Underline } from "react-feather";
import keyboardState from "../../../KeyboardState";
import { Atom } from "../../../model/chemistry/atoms/Atom";
import Reaction from "../../../model/Reaction";
import HoverDetector from "./HoverDetector";
import ReactionSaver from "./ReactionSaver";
import UndoManager from "./UndoManager";

interface Vector {
  x: number,
  y: number
}

/** Logic to move atoms or other objects in canvas */
class AtomMover {

	p5: p5
	reaction: Reaction
  hoverDetector: HoverDetector
	atomsBeingDraggedAndTheirStartPositions: Map<Atom, Vector>
  mouseStartPosition: {x: number, y: number}
  undoManager: UndoManager

	constructor(p5: p5, reaction: Reaction, hoverDetector: HoverDetector, undoManager: UndoManager) {
		this.p5 = p5
		this.reaction = reaction
    this.hoverDetector = hoverDetector
		this.atomsBeingDraggedAndTheirStartPositions = new Map<Atom, Vector>()
    this.mouseStartPosition = null
    this.undoManager = undoManager
	}

  // get position for each atom
  // for each atom, 

    // Replace this logic to just use the currently hovered atom
    // this is redundant with that logic
	startDraggingBodyIfPressed() {
    this.mouseStartPosition = {x: this.p5.mouseX / this.reaction.zoom, y: this.p5.mouseY / this.reaction.zoom}
    this.setAtomsBeingDragged()
  }

  getMoleculeThatAtomIsAPartOf(atom: Atom) {
    return this.reaction.currentStep.molecules.find(molecule => molecule.atoms.includes(atom))
  }

  setAtomsBeingDragged() {
    const atomHovered = this.hoverDetector.atomCurrentlyHovered
    if (atomHovered != null) {
      if (!keyboardState.shiftPressed) {
        this.addAtomToMap(atomHovered)
      } else if (keyboardState.shiftPressed) {
        // drag all atoms in the molecule this atom is a part of
        const atomsInMoleculeAtomHoveredIsPartOf = 
          this.getMoleculeThatAtomIsAPartOf(atomHovered).atoms
        atomsInMoleculeAtomHoveredIsPartOf.forEach(atom => {
          this.addAtomToMap(atom)
        })
      }
    }
  }

  addAtomToMap(atom: Atom) {
    const startPosition = {x: atom.getPosVector().x, y: atom.getPosVector().y}
    this.atomsBeingDraggedAndTheirStartPositions.set(atom, startPosition)
  }

	stopDraggingBody() {
    if (this.atomsBeingDraggedAndTheirStartPositions.size > 0) {
      this.undoManager.addUndoPoint()
      ReactionSaver.saveReaction(this.reaction)
		  this.atomsBeingDraggedAndTheirStartPositions.clear()
    }
	}

	dragAllAtomsRequired() {
    if (this.atomsBeingDraggedAndTheirStartPositions.size > 0) {
      const mouseDelta = {
        x : this.p5.mouseX / this.reaction.zoom - this.mouseStartPosition.x,
        y : this.p5.mouseY / this.reaction.zoom - this.mouseStartPosition.y
      }
      
      this.atomsBeingDraggedAndTheirStartPositions.forEach((originalPosition, atom) => 
        this.moveAtom(atom, originalPosition, mouseDelta))
    }
  }

  moveAtom(atom: Atom, originalPosition: Vector, delta: Vector) {
    atom.circle.pos.x = originalPosition.x + delta.x
    atom.circle.pos.y = originalPosition.y + delta.y
  }
	
}

export default AtomMover