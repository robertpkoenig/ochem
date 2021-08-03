import p5, { Element } from "p5";
import Constants from "../../Constants";
import Reaction from "../../model/Reaction";
import TeacherController from "./TeacherController";

class PanelController {

	// upstream objects
    p5: p5
	reaction: Reaction
	editorController: TeacherController

    // properties
    leftX: number | undefined
    rightX: number | undefined
    topY: number | undefined
    bottomY: number | undefined
    canvasParent: HTMLElement

    selectedElement: Element | null
    selectedElementId: string | null
	
	constructor(p5: p5, reaction: Reaction, editorController: TeacherController) {

        this.p5 = p5
		this.reaction = reaction
		this.editorController = editorController
        
        this.selectedElement = null
        this.selectedElementId = null

        this.canvasParent = null
        this.setCanvasParent()

	}

    setCanvasParent() {

        this.canvasParent = document.getElementById('p5-canvas')
        if (!this.canvasParent)
            throw new Error("canvas parent element not found")

        // this.canvasParent = canvasParent.getBoundingClientRect()
        // this.leftX = canvasParentRect.x
        // this.rightX = canvasParentRect.x + canvasParentRect.width
        // this.bottomY = canvasParentRect.y
        // this.topY = canvasParentRect.y + canvasParentRect.height

    }

	selectElement(id: string) {
        
        const elementDomElement = document.getElementById(id)
        if (!elementDomElement)
            throw new Error("no DOM element with this element ID found")

        elementDomElement.style.cursor = "grabbing"
        this.selectedElement = this.p5.select("#" + id)
        this.selectedElementId = id

	}

    moveElementIfSelected() {

        if (this.selectedElement != null) {
            const boundingRect = this.editorController.panelController.canvasParent.getBoundingClientRect()
            const xPosition = this.p5.mouseX + boundingRect.x - Constants.ATOM_RADIUS
            const yPosition = this.p5.mouseY + boundingRect.y- Constants.ATOM_RADIUS
            this.selectedElement.position(xPosition, yPosition)
        }

    }

    dropElement() {

        if (!this.selectedElementId) 
            throw new Error("No element was selected that could be dropped")

        // do not create atom if currently outside the canvas
        if (this.p5.mouseX >= 0 && this.p5.mouseX <= this.p5.width &&
            this.p5.mouseY >= 0 && this.p5.mouseY <= this.p5.height) {
            this.editorController.atomCreator.createNewSingleAtomMolecule(this.selectedElementId)
        }

        this.resetTheDummyAtom(this.selectedElementId)

        this.selectedElementId = null
        this.selectedElement = null

    }

    resetTheDummyAtom(id: string) {

        const atom = document.getElementById(id)
        if (!atom)
            throw new Error("no atom with id " + id + " was found in the DOM")

        atom.style.cursor = "grab"
        atom.style.left = "0"
        atom.style.top = "0"
        atom.style.position = "relative"

    }

}

export default PanelController