import p5, { Element } from "p5";
import Constants from "../../Constants";
import { Atom } from "../../model/chemistry/atoms/Atom";
import BondType from "../../model/chemistry/bonds/BondType";
import { ArrowType } from "../../model/chemistry/CurlyArrow";
import Molecule from "../../model/chemistry/Molecule";
import Reaction from "../../model/Reaction";
import ReactionStep from "../../model/ReactionStep";
import ReactionStepLoader from "../../utilities/ReactionStepLoader";
import Utilities from "../../utilities/Utilities";
import DomElementCreator from "../../view/DomElementCreator";
import { EditorController } from "./EditorController";

class PanelController {

	// upstream objects
    p5: p5
	reaction: Reaction
	editorController: EditorController

    // properties
    leftX: number
    rightX: number
    topY: number
    bottomY: number

    physicsOn: boolean
    eraserOn: boolean
    bondType: BondType
    curlyArrowType: ArrowType

    selectedElement: Element
	
	constructor(p5: p5, reaction: Reaction, editorController: EditorController) {

        this.p5 = p5
		this.reaction = reaction
		this.editorController = editorController

        this.physicsOn = false
        this.eraserOn = false
        this.bondType = null
        this.curlyArrowType = null
        
        this.selectedElement = null

        this.setOffsets()

	}

    toggleCurlyArrow(arrowType: ArrowType) {

        console.log("hello");
        

        // Unselect both buttons
        document.getElementById("curly-arrow-single")

        // If the curly arrow is not set, simply set it
        if (this.curlyArrowType == null) {
            this.curlyArrowType = arrowType
            document.getElementById("curly-arrow-" + arrowType)
            .classList.toggle("selected")
        }
        // Else if the new curly arrow type is the one selected,
        // set arrow type to null and unselect the DOM element
        else if (this.curlyArrowType == arrowType) {
            this.curlyArrowType = null
            document.getElementById("curly-arrow-" + arrowType)
                .classList.toggle("selected")
        }
        // If the curly arrow is already set, simply 
        // set it to the new value, and toggle the class
        // list for both buttons
        else {
            this.curlyArrowType = arrowType
            document.getElementById("curly-arrow-SINGLE")
                .classList.toggle("selected")
            document.getElementById("curly-arrow-DOUBLE")
                .classList.toggle("selected")
        }

    }

    togglePhysics() {
        this.physicsOn = !this.physicsOn

        if (this.physicsOn) {
            document.getElementById("physics-state").style.color = "blue"
            document.getElementById("physics-state").innerHTML = "On"
        }
        else {
            document.getElementById("physics-state").style.color = "#ddd"
            document.getElementById("physics-state").innerHTML = "Off"
        }

        // console.log("model molcules: ", this.model.molecules.length);
        
        // for (const molecule of this.model.molecules) {
        //     console.log("molecule bodies", molecule.atoms.length);
        // }

    }

    setOffsets() {

        const canvasParent = document.getElementById('editor-canvas')
        const canvasParentRect = canvasParent.getBoundingClientRect()
        this.leftX = canvasParentRect.x
        this.rightX = canvasParentRect.x + canvasParentRect.width
        this.bottomY = canvasParentRect.y
        this.topY = canvasParentRect.y + canvasParentRect.height

    }

	selectElement(id: string) {
        document.getElementById(id).style.cursor = "grabbing"
		this.selectedElement = this.p5.select("#" + id)
	}

    unselectBondTypesIfSelected() {
        if (this.bondType != null) {
            document.getElementById(this.bondType).classList.toggle("selected")
            this.bondType = null
        }
    }

    moveElementIfSelected() {

        if (this.selectedElement != null) {
            const xPosition = this.p5.mouseX + this.leftX - Constants.EDITOR_PANEL_ATOM_W_H / 2
            const yPosition = this.p5.mouseY + this.bottomY - Constants.EDITOR_PANEL_ATOM_W_H / 2
            this.selectedElement.position(xPosition, yPosition)
        }

    }

    dropElement(id: string) {

        this.selectedElement = null

        // do not create atom of currently outside the canvas
        if (this.p5.mouseX >= 0 && this.p5.mouseX <= this.p5.width &&
            this.p5.mouseY >= 0 && this.p5.mouseY <= this.p5.height) {
            this.editorController.atomCreator.createNewSingleAtomMolecule(id)
        }

        this.resetTheDummyAtom(id)

    }

    resetTheDummyAtom(id: string) {
        const atom = document.getElementById(id)
        atom.style.cursor = "grab"
        atom.style.left = "0"
        atom.style.top = "0"
        atom.style.position = "relative"
    }

    addAtomToNewMolecule(atom: Atom) {
        const newMolecule = new Molecule()
        newMolecule.atoms.push(atom)
        // atom.molecule = newMolecule
        this.reaction.currentStep.molecules.push(newMolecule)
    }

    selectBondType(bondType: BondType) {

        // This is a little awkward. I am using the reverse mapping
        // of Typescript's enum objects.
        let selectedBondType = BondType[bondType]

        // if there is not bond type, simply set it
        if (this.bondType == null) {
            this.bondType = selectedBondType
        }

        else {

            // simply remove the selectedBondType if the same bond type
            // has been clicked again
            if (this.bondType == selectedBondType) {
                this.bondType = null
            }

            // if another bond type is already selected, remove the
            // 'selected' CSS class from it, and set the new bond type
            else {
                document.getElementById(this.bondType).classList.toggle("selected")
                this.bondType = selectedBondType
            }

        }

        // In any case, toggle the 'selected' CSS class on the button
        document.getElementById(selectedBondType).classList.toggle("selected")
        
    }

    toggleEraser() {
        this.eraserOn = !this.eraserOn
        document.getElementById("eraser").classList.toggle("selected")
    }

    undo() {
        this.editorController.undoManager.undo()
    }

    redo() {
        this.editorController.undoManager.redo()
    }

    createNewStepFromPopup() {

        const steps = this.editorController.reaction.steps
        const lastStep = steps[steps.length - 1]
        const lastStepJSON = JSON.stringify(lastStep)
        const newStep = ReactionStepLoader.loadReactionStateFromJSON(lastStepJSON)
        newStep.id = Utilities.generateUid()

        const nameInput = 
            <HTMLInputElement>document.getElementById("step-name")
        const newStepName = nameInput.value
        newStep.name = newStepName

        this.editorController.reaction.steps.push(newStep)
        document.getElementById("create-step-popup").style.visibility = "hidden"
        DomElementCreator.setStateCards(this.editorController.reaction)

        this.setCurrentState(newStep.id)

    }

    showNewStepPopup() {
        document.getElementById("create-step-popup").style.visibility = "visible" 
    }

    setCurrentState(stepId: string) {
        // const currentStepId = this.editorController.reaction.currentStep
        // console.log("step-indicator-" + currentStepId);
        // hide the current state indicator
        if (this.editorController.reaction.currentStep != null) {
            const currentStepId = this.editorController.reaction.currentStep.id
            document.getElementById("step-indicator-" + currentStepId).style.display = "none"
        }
        for (const step of this.editorController.reaction.steps) {
            if (step.id == stepId) {
                this.editorController.reaction.currentStep = step
                document.getElementById("step-indicator-" + stepId).style.display = "block"
            } 
        }
    }

}

export default PanelController