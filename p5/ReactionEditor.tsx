import React from "react"
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
import { ArrowType } from "./model/chemistry/CurlyArrow"
import PanelController from "./controller/editor/PanelController"
import BondType from "./model/chemistry/bonds/BondType"

const panel = `rounded-md shadow p-5 bg-white flex items-center justify-between w-96`
const buttonGrid = `flex flex-row gap-2`
const squareButton = `bg-gray-300 rounded-sm pointer w-20 h-20 flex content-center items-center`
const selectedButton = squareButton + `bg-indigo-500`

interface IProps {

}

interface IState {
    p5: p5 | null
    physicsOn: boolean
    eraserOn: boolean
    bondType: BondType | null
    curlyArrowType: ArrowType | null
}

// This is set to point to the instance of the ReactionEditor class created below.
// This is then passed to the P5 objects.
// That way, both the DOM elements and the P5 objects can have a single source
// of state for the things like physics on/off and selected bond type, while 
// changes to the state will trigger DOM updates through React.
let reactionEditor: ReactionEditor

class ReactionEditor extends React.Component<IProps, IState> {

    constructor(props: IProps) {

        super(props)

        this.state = {
            p5: null,
            physicsOn: false,
            eraserOn: false,
            bondType: null,
            curlyArrowType: null
        }

        // This is explained in the comments starting on line 33
        reactionEditor = this

        this.togglePhysics = this.togglePhysics.bind(this)
        
    }

    componentDidMount() {
        // this.setState({
        //     ...this.state,
        //     p5: new p5(this.sketch)
        // })
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

        p5.setup = () => {

            const canvasParent = document.getElementById('editor-canvas')
            if (canvasParent == null) {
                throw new Error("p5 canvas parent element not found")
            }
            const canvasParentRect = canvasParent.getBoundingClientRect()
            const canvas = p5.createCanvas(canvasParentRect.width - 50, canvasParentRect.height)
			canvas.parent('editor-canvas')

            const reactionState = new ReactionStep()
            reaction = new Reaction()
            reaction.steps.push(reactionState)
            
            reaction.currentStep = reactionState
            studentView = new View(p5, reaction)
            collisionDetector = new CollisionDetector(p5, reaction)
            physicsEngine = new PhysicsEngine(reaction)
            controller = new Controller(p5, reaction, collisionDetector)
            editorView = new EditorView(p5, reaction, controller.editorController, collisionDetector)

            // move this to the view setup logic
            DomElementCreator.populateEditorPanel()
            DomElementCreator.setStateCards(reaction)

            window.p5 = p5
        }

        p5.draw = () => {
            
            controller.process()

            if (reactionEditor.state.physicsOn) {
                physicsEngine.applyPhysics()
            }

            reaction.update()
        
            p5.background(150)
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

    togglePhysics() {
        this.setState((prevState) => {
            return {
                ...prevState,
                physicsOn: !prevState.physicsOn,
                bondType: null,
                eraserOn: false,
                curlyArrowType: null
            }
        })        
    }

    toggleEraser() {
        this.setState((prevState) => {
            return {
                ...prevState,
                eraserOn: !prevState.eraserOn,
                bondType: null,
                curlyArrowType: null
            }
        })        
    }

    setBondType(bondType: BondType) {
        this.setState((prevState) => {
            return {
                ...prevState,
                bondType: bondType,
                curlyArrowType: null,
                eraserOn: false
            }
        })        
    }

    setArrowType(arrowType: ArrowType) {
        this.setState((prevState) => {
            return {
                ...prevState,
                curlyArrowType: arrowType,
                bondType: null,
                eraserOn: false
            }
        })        
    }

    render() {



        return (

        <div>
		
            <div id="editor" className="flex flex-row">
    
                {/* <!-- wrapper for editor panel to keep v centered --> */}
                <div className="flex flex-col gap-10">
    
                    {/* <!-- physics --> */}
                    <div className={panel}>
                        <h3>Physics</h3>
    
                        <div className={this.state.eraserOn ? selectedButton : squareButton}>
                            <div id="physics-state">Off</div>
                            <label className="switch">
                                <input onClick={this.togglePhysics} type="checkbox" id="toggle" />
                                <span className="slider round"></span>
                            </label>
                        </div>
    
                    </div>
    
                    {/* <!-- Clear and undo control --> */}
                    <div className={panel}>
    
                        <h3>Editing</h3>
    
                        <div className={buttonGrid}>
                            <button
                                className={squareButton}
                                id="eraser"
                            >
                                <img src="/assets/images/eraser.svg" alt="eraser" />
                            </button>
                            <button className={squareButton} id="undo" >
                                <i className="feather-rotate-ccw"></i>
                            </button>
                            <button className={squareButton} id="redo" >
                                <i  className="feather-rotate-cw"></i>
                            </button>
                        </div>
    
                    </div>
    
                    <div className={panel}>
                        <h3>Bond</h3>
                        {/* <!-- This is filled by JS in the DOMElementCreator className --> */}
                        <div id="bond-grid" className={buttonGrid}></div>
                    </div>
    
                    <div className={panel}>
                        <h3>Curly Arrows</h3>
                        <div className={buttonGrid}>
                        <button className={squareButton} id="curly-arrow-SINGLE" onClick={() => window.panelController.toggleCurlyArrow(ArrowType.SINGLE)} >
                            <img src="/assets/images/curly_arrows/double.svg" alt="eraser"  />
                        </button>
                        <button className={squareButton} id="curly-arrow-DOUBLE" >
                            <img src="/assets/images/curly_arrows/single.svg" alt="eraser" />
                        </button>
                    </div>
                    </div>
    
                    {/* <!-- Steps panel --> */}
                    <div className={panel}>
    
                        <h3>Reaction Steps</h3>
    
                        {/* <!-- List of steps --> */}
                        <div className="flex flex-col gap-2">
    
                            {/* <!-- This is filled by the DOM element creator className--> */}
                            <div id="list-of-steps" className="flex flex-col gap-2">
                                <div className="step-card">
                                    Name of the step
                                </div>
                            </div>
    
                            <div className="flex flex-row">
                                <div className="add-step-text">
                                    + add step
                                </div>
                            </div>
    
                        </div>
    
                    </div>
    
                </div>
    
                {/* <!-- Editor P5 canvas --> */}
                <div id="editor-canvas" className="w-700 h-screen"></div>
    
                {/* <!-- wrapper for editor panel to keep v centered --> */}
                <div className="flex flex-col" >
                    <div className={panel + "flex-col"}>
                        <div>
                        {/* <!-- This is filled by JS in the DOMElementCreator className --> */}
                            <div id="element-grid" className="flex flex-col gap-4 p-5 overflow-scroll"></div>
                        </div>
                    </div>
                </div>
    
                {/* <!-- Eraser highlight --> */}
                <div id="eraser-tip" className="text-xs bg-gray-400 text-white rounded-sm shadow pt-2 font-light absolute " >
                    Delete
                </div>
    
                {/* <!-- Create step popup --> */}
                <div id="create-step-popup" className="invisible" >
                    <div className="popup new-step-name">
                        <div className="c-flex gap10">
                            <h3>New Step</h3>
                            <input id="step-name" className="step-name" type="text" placeholder="Type step name here..." />
                            <button className="text-button">Confirm</button>
                        </div>
                    </div>
                </div>
    
            </div>
    
        </div>

        )
    }

}

export default ReactionEditor