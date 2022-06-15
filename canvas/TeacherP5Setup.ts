import p5 from 'p5'
import { Vector } from 'sat'
import CollisionDetector from './view/CollisinDetector'
import { PhysicsEngine } from './model/physics/PhysicsEngine'
import Utilities from './utilities/Utilities'
import { View } from './view/View'
import Reaction from './model/Reaction'
import { ITeacherState } from '../pages/teacher/reactions/[reactionId]'
import UserType from './model/UserType'
import { CANVAS_PARENT_NAME } from './Constants'
import TeacherController from './controller/teacher/TeacherController'

function createTeacherP5Context(
    pageState: ITeacherState,
    setP5: (p5: p5) => void,
    setController: (controller: TeacherController) => void,
    reaction: Reaction
) {
    new p5(sketch)

    function sketch(p5: p5) { // Confusing code structure dictated by p5.js

        let view: View
        let physicsEngine: PhysicsEngine
        let collisionDetector: CollisionDetector
        let controller: TeacherController
    
        // Contains the setup logic for the p5 instance
        p5.setup = () => {

            const canvasParent = document.getElementById(CANVAS_PARENT_NAME)
            const canvasParentRect = canvasParent.getBoundingClientRect()
            const canvas = p5.createCanvas(canvasParentRect.width, 700)
            canvas.style("border-radius", "0.5rem")
            canvas.parent(CANVAS_PARENT_NAME)

            collisionDetector = new CollisionDetector(p5, reaction)
            physicsEngine = new PhysicsEngine(reaction)
            controller = new TeacherController(p5, reaction, collisionDetector, pageState)
            view = new View(p5, reaction, controller, UserType.TEACHER)

            setP5(p5)
            setController(controller)

        }
    
        // This is run continuously while the p5 instance is active
        p5.draw = () => {

            // Clear the canvas
            p5.background(255)

            reaction.update()
    
            physicsEngine.makeBondLengthCorrect()
            physicsEngine.applyAllForces()

            controller.process()
        
            view.render()
    
        }
    
        // Triggered whenever p5 senses a mousePress anywhere on the page
        p5.mousePressed = () => {
            const mouseVector = new Vector(p5.mouseX, p5.mouseY)
            controller.routeMousePressed(mouseVector)
        }
    
        // Triggered when mouse is released anywhere on the page
        p5.mouseReleased = () => {
            const mouseVector = new Vector(p5.mouseX, p5.mouseY)
            controller.routeMouseReleased(mouseVector)
        }
    
        // Triggered when a keyboard key is pressed
        p5.keyPressed = () => {
            if (p5.key == "=") Utilities.printReactionState(reaction)
        }
    }
}

export default createTeacherP5Context