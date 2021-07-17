import React from "react"
import { Switch } from '@headlessui/react'
import { AtomicElements } from "../../../p5/model/chemistry/atoms/elements"
import BondType from "../../../p5/model/chemistry/bonds/BondType"
import { ArrowType } from "../../../p5/model/chemistry/CurlyArrow"

const panel = `rounded-md shadow p-5 bg-white flex items-center justify-between w-96`
const buttonGrid = `flex flex-row gap-2`
const squareButton = `bg-indigo-600 rounded-sm pointer w-8 h-8 flex justify-center items-center hover:bg-indigo-700 `
const selectedButton = squareButton + "bg-indigo-700 ring-2 ring-offset-2 ring-indigo-500 "
const buttonImage = "w-4 h-4"

interface IProps {

}

interface IState {
    physicsOn: boolean
    eraserOn: boolean
    bondType: BondType | null
    arrowType: ArrowType | null
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
            physicsOn: false,
            eraserOn: false,
            bondType: null,
            arrowType: null
        }

        // This is explained in the comments starting on line 33
        reactionEditor = this

        this.togglePhysics = this.togglePhysics.bind(this)
        
    }

    togglePhysics() {
        this.setState((prevState) => {
            return {
                ...prevState,
                physicsOn: !prevState.physicsOn,
                bondType: null,
                eraserOn: false,
                arrowType: null
            }
        })        
    }

    toggleEraser() {
        this.setState((prevState) => {
            return {
                ...prevState,
                eraserOn: !prevState.eraserOn,
                bondType: null,
                arrowType: null
            }
        })        
    }

    setBondType(bondType: BondType) {

        if (this.state.bondType == bondType) {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    bondType: null
                }
            })  
        }

        else {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    bondType: bondType,
                    arrowType: null,
                    eraserOn: false
                }
            }) 
        }

    }

    setArrowType(arrowType: ArrowType) {

        if (this.state.arrowType == arrowType) {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    arrowType: null
                }
            })  
        }

        else {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    arrowType: arrowType,
                    bondType: null,
                    eraserOn: false
                }
            }) 
        }
       
    }

    render() {

        const bondTypeButtons = Object.values(BondType).map(bondType => {
            return (
                <button 
                    className={this.state.bondType == bondType ? selectedButton : squareButton}
                    onClick={() => this.setBondType(bondType)}
                >
                    <img 
                        src={"/assets/images/bonds/" + bondType + ".svg"}
                        alt={bondType + " bond"}
                        className={buttonImage}
                    />
                </button>
            )
        })

        const listOfAtomicElements = Object.values(AtomicElements).map(element => {
            return (

                // This is the background to the atom which acts as the empty state
                // when the element is dragged onto the canvas
                <div className="rounded-full w-12 h-12 bg-gray-200">

                    <button
                        style={{backgroundColor: element.color, cursor: "grab"}}
                        className="rounded-full w-12 h-12 text-white font-semibold text-lg flex items-center justify-center z-10"
                    >
                        {element.abbreviation}
                    </button>

                </div>

            )
        })
        

        return (

        <div>
		
            <div id="editor" className="flex flex-row">
    
                {/* <!-- wrapper for editor panel to keep v centered --> */}
                <div className="flex flex-col gap-3">
    
                    {/* <!-- physics --> */}
                    <div className={panel}>
                        <h3>Physics</h3>

                        <div className="flex flex-row gap-2">
                            <div
                                className={this.state.physicsOn ? "text-indigo-500" : "text-gray-400"}
                            >
                                {this.state.physicsOn ? "On" : "Off"}
                            </div>
        
                            <Switch
                                checked={this.state.physicsOn}
                                onChange={() => this.togglePhysics()}
                                className={
                                    (this.state.physicsOn ? 'bg-indigo-600 ' : 'bg-gray-200 ') +
                                    'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200'
                                }
                                >
                                <span className="sr-only">Toggle physics</span>
                                <span
                                    aria-hidden="true"
                                    className={
                                        (this.state.physicsOn ? 'translate-x-5 ' : 'translate-x-0 ') + 
                                        'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                                    }
                                />
                            </Switch>
                        </div>
    
                    </div>
    
                    {/* <!-- Clear and undo control --> */}
                    <div className={panel}>
    
                        <h3>Editing</h3>
    
                        <div className={buttonGrid}>

                            <button
                                className={this.state.eraserOn ? selectedButton : squareButton}
                                onClick={() => this.toggleEraser()}
                            >
                                <img className={buttonImage} src="/assets/images/eraser.svg" alt="eraser" />
                            </button>

                            {/* Undo */}
                            <button
                                className={squareButton}
                                // add in logic to trigger the undo
                            >
                                <i className="feather-rotate-ccw"></i>
                            </button>

                            {/* Redo */}
                            <button
                                className={squareButton}
                                // add logic to trigger the redo
                            >
                                <i  className="feather-rotate-cw"></i>
                            </button>

                        </div>
    
                    </div>
    
                    <div className={panel}>
                        <h3>Bond</h3>
                        {/* <!-- This is filled by JS in the DOMElementCreator className --> */}
                        <div className={buttonGrid}>
                            {bondTypeButtons}
                        </div>
                    </div>
    
                    <div className={panel}>
                        <h3>Curly Arrows</h3>
                        <div className={buttonGrid}>
                            
                            {/* Double curly arrow */}
                            <button
                                className={this.state.arrowType == ArrowType.DOUBLE ? selectedButton : squareButton}
                                onClick={() => this.setArrowType(ArrowType.DOUBLE)}
                            >
                                <img className={buttonImage} src="/assets/images/curly_arrows/double.svg" alt="double curly arrow"  />
                            </button>

                            {/* Single curly arrow */}
                            <button
                                className={this.state.arrowType == ArrowType.SINGLE ? selectedButton : squareButton}
                                onClick={() => this.setArrowType(ArrowType.SINGLE)}

                            >
                                <img className={buttonImage} src="/assets/images/curly_arrows/single.svg" alt="single curly arrow" />
                            </button>
                        </div>
                    </div>
    
                    {/* <!-- Steps panel --> */}
                    {/* <div className={panel}>
    
                        <h3>Reaction Steps</h3> */}
    
                        {/* <!-- List of steps --> */}
                        {/* <div className="flex flex-col gap-2"> */}
    
                            {/* <!-- This is filled by the DOM element creator className--> */}
                            {/* <div id="list-of-steps" className="flex flex-col gap-2">
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
    
                    </div> */}
    
                </div>
    
                {/* <!-- Editor P5 canvas --> */}
                <div id="editor-canvas" className="w-700 h-screen"></div>
    
                {/* <!-- wrapper for editor panel to keep v centered --> */}
                <div className="flex flex-col" >
                    <div className={panel + "flex-col"}>
                        <div>
                        {/* <!-- This is filled by JS in the DOMElementCreator className --> */}
                            <div id="element-grid" className="flex flex-col gap-4 overflow-scroll">
                                {listOfAtomicElements}
                            </div>
                        </div>
                    </div>
                </div>
    
                {/* <!-- Eraser tip --> */}
                <div
                    id="eraser-tip"
                    style={{visibility: "hidden"}}
                    className=" text-xs bg-gray-400 text-white rounded-sm shadow p-1.5
                                font-light absolute flex flex-col justify-center items-center"
                    >
                    Delete
                </div>
    
                {/* <!-- Create step popup --> */}
                {/* <div id="create-step-popup" className="invisible" >
                    <div className="popup new-step-name">
                        <div className="c-flex gap10">
                            <h3>New Step</h3>
                            <input id="step-name" className="step-name" type="text" placeholder="Type step name here..." />
                            <button className="text-button">Confirm</button>
                        </div>
                    </div>
                </div> */}
    
            </div>
    
        </div>

        )
    }

}

export default ReactionEditor