import p5 from 'p5'
import { Vector } from 'sat'
import CollisionDetector from './view/CollisinDetector'
import { PhysicsEngine } from './model/physics/PhysicsEngine'
import Utilities from './utilities/Utilities'
import { View } from './view/View'
import Reaction from './model/Reaction'
import UserType from './model/UserType'
import { CANVAS_PARENT_NAME } from './Constants'
import { IStudentState } from '../pages/student/reactions/[reactionId]'
import StudentController from './controller/student/StudentController'

function createP5Context(
    pageState: IStudentState,
    setP5: (p5: p5) => void,
    reaction: Reaction,
    arrowDrawnCorrectly: () => void,
    arrowDrawnIncorrectly: () => void,
) {
    new p5(sketch)

    function sketch(p5: p5) {

        let view: View
        let physicsEngine: PhysicsEngine
        let collisionDetector: CollisionDetector
        let controller: StudentController
    
        // Contains the setup logic for the p5 instance
        p5.setup = () => {

            const canvasParent = document.getElementById(CANVAS_PARENT_NAME)
            const canvasParentRect = canvasParent.getBoundingClientRect()
            const canvas = p5.createCanvas(canvasParentRect.width, 700)
            canvas.style("border-radius", "0.5rem")
            canvas.parent(CANVAS_PARENT_NAME)

            collisionDetector = new CollisionDetector(p5, reaction)
            physicsEngine = new PhysicsEngine(reaction)
            controller = new StudentController(p5, reaction, collisionDetector, pageState, arrowDrawnCorrectly, arrowDrawnIncorrectly)
            view = new View(p5, reaction, controller, UserType.STUDENT)

            setP5(p5)

        }
    
        // This is run continuously while the p5 instance is active
        p5.draw = () => {
            
            // Clear the canvas
            p5.scale(reaction.zoom)
            p5.background(255)

            reaction.update()
    
            physicsEngine.makeBondLengthCorrect()
            physicsEngine.applyAllForces()

            controller.process()
        
            view.render()
    
        }
    
        // Triggered whenever p5 senses a mousePress anywhere on the page
        p5.mousePressed = () => {
            const mouseVector = new Vector(p5.mouseX / controller.reaction.zoom, p5.mouseY / controller.reaction.zoom)
            controller.routeMousePressed(mouseVector)
        }
    
        // Triggered when mouse is released anywhere on the page
        p5.mouseReleased = () => {
            const mouseVector = new Vector(p5.mouseX / controller.reaction.zoom, p5.mouseY / controller.reaction.zoom)
            controller.routeMouseReleased(mouseVector)
        }
    
        // See the reaction state for debugging purposes
        p5.keyPressed = () => {
            if (p5.key == "=") Utilities.printReactionState(reaction)
        }
    }
}

export default createP5Context