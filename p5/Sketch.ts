import p5, { Element } from 'p5'
import { Vector } from 'sat'
import { Controller } from './controller/Controller'
import ReactionStep from './model/ReactionStep'
import CollisionDetector from './model/physics/CollisinDetector'
import { PhysicsEngine } from './model/physics/PhysicsEngine'
import Utilities from './utilities/Utilities'
import { View } from './view/View'
import DomElementCreator from './view/DomElementCreator'
import EditorView from './view/EditorView'
import Reaction from './model/Reaction'
import ReactionEditor from '../pages/editor/reactions/test'

let reactionEditor: ReactionEditor | null

class Sketch {

    p5: p5

    constructor(newReactionEditor: ReactionEditor) {
        reactionEditor = newReactionEditor
        this.p5 = new p5(this.sketch)
    }

    sketch(p5: p5) {

        let reaction: Reaction
        let studentView: View
        let physicsEngine: PhysicsEngine
        let collisionDetector: CollisionDetector
        let controller: Controller
        let editorView: EditorView

		let button: Element
		let canvasParent: Element

        const CANVAS_PARENT_NAME = "p5-canvas"

        p5.setup = () => {

            console.log("setup triggered");
            
            const canvasParent = document.getElementById(CANVAS_PARENT_NAME)

            if (canvasParent === null) {
                throw new Error("p5 parent element container was not found")
            }
            const canvasParentRect = canvasParent.getBoundingClientRect()
            const canvas = p5.createCanvas(canvasParentRect.width - 50, canvasParentRect.height)
			canvas.parent(CANVAS_PARENT_NAME)

            const reactionState = new ReactionStep()
            reaction = new Reaction()
            reaction.steps.push(reactionState)
            
            reaction.currentStep = reactionState
            studentView = new View(p5, reaction)
            collisionDetector = new CollisionDetector(p5, reaction)
            physicsEngine = new PhysicsEngine(reaction)
            if (reactionEditor == null) {
                throw new Error("reactionEditor was not defined")
            }
            controller = new Controller(p5, reaction, collisionDetector, reactionEditor)
            editorView = new EditorView(p5, reaction, controller.editorController, collisionDetector)

            window.p5 = p5
            reactionEditor.setUndoManager(controller.editorController.undoManager)
			
        }

        p5.draw = () => {
            
            controller.process()

            if (controller.editorController.reactionEditor.state.physicsOn) {
                physicsEngine.applyPhysics()
            }

            reaction.update()
        
            p5.background(255)
            editorView.render()
            studentView.render()

        }

        p5.mousePressed = () => {
            const mouseVector = new Vector(p5.mouseX, p5.mouseY)
            controller.routeMousePressed(mouseVector)
        }

        p5.mouseReleased = () => {
            const mouseVector = new Vector(p5.mouseX, p5.mouseY)
            controller.routeMouseReleased(mouseVector)
        }

        p5.keyPressed = () => {
            if (p5.key == "=") Utilities.printReactionState(reaction)
        }

    }

}

export default Sketch