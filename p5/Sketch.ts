import p5 from 'p5'
import { Vector } from 'sat'
import { Controller } from './controller/Controller'
import CollisionDetector from './view/CollisinDetector'
import { PhysicsEngine } from './model/physics/PhysicsEngine'
import Utilities from './utilities/Utilities'
import { View } from './view/View'
import Reaction from './model/Reaction'
import TeacherReactionPage from '../pages/teacher/reactions/[reactionId]'
import StudentReactionPage from '../pages/student/reactions/[reactionId]'
import UserType from './model/UserType'
import Constants from './Constants'

function createP5Context(
    page: TeacherReactionPage | StudentReactionPage,
    userType: UserType,
    reaction: Reaction) {

    new p5(sketch)

    function sketch(p5: p5) {

        let view: View
        let physicsEngine: PhysicsEngine
        let collisionDetector: CollisionDetector
        let controller: Controller
    
        // Contains the setup logic for the p5 instance
        p5.setup = () => {

            const canvasParent = document.getElementById(Constants.CANVAS_PARENT_NAME)
            const canvasParentRect = canvasParent.getBoundingClientRect()
            const canvas = p5.createCanvas(canvasParentRect.width, 700)
            canvas.style("border-radius", "0.5rem")
            canvas.parent(Constants.CANVAS_PARENT_NAME)

            collisionDetector = new CollisionDetector(p5, reaction)
            physicsEngine = new PhysicsEngine(reaction)
            controller = new Controller(p5, reaction, collisionDetector, page, userType)
            view = new View(p5, reaction, controller, userType)

            page.setP5(p5)
           
        }
    
        // This is run continuously while the p5 instance is active
        p5.draw = () => {

            // Clear the canvas
            p5.background(255)

            reaction.update()
    
            if (controller.teacherController?.teacherReactionPage.state.repulsionOn) { 
                physicsEngine.applyBodyRepulsionWithinMolecules()
            }
            if (controller.teacherController?.teacherReactionPage.state.attractionOn
                || controller.studentController != null) {
                physicsEngine.makeBondLengthCorrect()
            }
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

export default createP5Context