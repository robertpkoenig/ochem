import p5, { Element } from "p5";
import { ATOM_RADIUS } from "../../../Constants";
import Reaction from "../../../model/Reaction";
import TeacherController from "../TeacherController";

/**
 * Handles interation with the panel of elements on the right side of the canvas.
 * The panel is a div, and each atom in it is a div.
 * When dragged onto the canvas, a p5 atom object of the same element is created
 * in the canvas at that location, and the atom div is returned to the panel div.
 */
class PanelController {
  // upstream objects
  p5: p5;
  reaction: Reaction;
  editorController: TeacherController;

  // properties
  canvasParent: HTMLElement;

  selectedElement: Element | null;
  selectedElementId: string | null;

  constructor(p5: p5, reaction: Reaction, editorController: TeacherController) {
    this.p5 = p5;
    this.reaction = reaction;
    this.editorController = editorController;

    this.selectedElement = null;
    this.selectedElementId = null;

    this.canvasParent = null;
    this.setCanvasParent();
  }

  // Initialize by adding the panel DOM element into the p5 canvas DOM element
  setCanvasParent() {
    this.canvasParent = document.getElementById("p5-canvas");
    if (!this.canvasParent) throw new Error("canvas parent element not found");
  }

  /**
   * Selects an element. That means when the mouse moves, the element div
   * is moved to match the mouse.
   */
  selectElement(id: string) {
    const elementDomElement = document.getElementById(id);
    if (!elementDomElement)
      throw new Error("no DOM element with this element ID found");

    elementDomElement.style.cursor = "grabbing";
    this.selectedElement = this.p5.select("#" + id);
    this.selectedElementId = id;
  }

  moveSelectedElementIfOneIsSelected() {
    if (this.selectedElement != null) {
      const boundingRect =
        this.editorController.panelController.canvasParent.getBoundingClientRect();
      const xPosition = this.p5.mouseX + boundingRect.x - ATOM_RADIUS;
      const yPosition =
        this.p5.mouseY + boundingRect.y - ATOM_RADIUS + window.scrollY;
      this.selectedElement.position(xPosition, yPosition);
    }
  }

  dropElement() {
    if (!this.selectedElementId)
      throw new Error("No element was selected that could be dropped");

    // do not create atom if currently outside the canvas
    if (
      this.p5.mouseX >= 0 &&
      this.p5.mouseX <= this.p5.width &&
      this.p5.mouseY >= 0 &&
      this.p5.mouseY <= this.p5.height
    ) {
      this.editorController.atomCreator.createNewMoleculeWithOneAtomOfElementInEachStep(
        this.selectedElementId
      );
    }

    this.resetTheDummyAtom(this.selectedElementId);

    this.selectedElementId = null;
    this.selectedElement = null;
  }

  resetTheDummyAtom(id: string) {
    const atom = document.getElementById(id);
    if (!atom)
      throw new Error("no atom with id " + id + " was found in the DOM");

    atom.style.cursor = "grab";
    atom.style.left = "0";
    atom.style.top = "0";
    atom.style.position = "relative";
  }
}

export default PanelController;
