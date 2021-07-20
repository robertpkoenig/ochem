import { Switch } from "@headlessui/react"
import { ArrowLeftIcon, PlusIcon, XIcon } from "@heroicons/react/solid"
import Link from "next/link"
import { NextRouter, withRouter } from "next/router"
import React from "react"
import { RotateCcw, RotateCw, ThumbsDown } from "react-feather"
import ReactionSaver from "../../../p5/controller/editor/ReactionSaver"
import UndoManager from "../../../p5/controller/editor/UndoManager"
import { AtomicElements } from "../../../p5/model/chemistry/atoms/elements"
import BondType from "../../../p5/model/chemistry/bonds/BondType"
import { ArrowType } from "../../../p5/model/chemistry/CurlyArrow"
import Reaction from "../../../p5/model/Reaction"
import ReactionStep from "../../../p5/model/ReactionStep"
import ReactionLoader from "../../../p5/utilities/ReactionLoader"
import ReactionStepLoader from "../../../p5/utilities/ReactionStepLoader"
import Utilities from "../../../p5/utilities/Utilities"

const panel = `rounded-md shadow p-5 bg-white flex items-center justify-between w-96`
const buttonGrid = `flex flex-row gap-2`
const squareButton = `text-white bg-indigo-600 rounded-md pointer w-8 h-8 flex justify-center items-center hover:bg-indigo-700 `
const selectedButton = squareButton + "bg-indigo-700 ring-2 ring-offset-2 ring-indigo-500 "
const buttonImage = "w-4 h-4"

interface WithRouterProps {
    router: NextRouter
}

interface IProps extends WithRouterProps {

}

interface IState {
    reaction: Reaction | null
    reactionId: string
    physicsOn: boolean
    eraserOn: boolean
    bondType: BondType | null
    arrowType: ArrowType | null
    undoManager: UndoManager | null
    selectedElement: HTMLElement | null
}

class ReactionEditor extends React.Component<IProps, IState> {

    constructor(props: IProps) {

        super(props)

        const reactionId = this.props.router.query.reactionId

        this.state = {
            reaction: null,
            reactionId: reactionId as string,
            physicsOn: false,
            eraserOn: false,
            bondType: null,
            arrowType: null,
            undoManager: null,
            selectedElement: null,
        }

    }

   
    async componentDidMount() {

        // Add logic to redirect if uuid of reaction is missing

        const reactionRawJSON: string | null = localStorage.getItem(this.state.reactionId)
        let reaction: Reaction | null = null
        if (reactionRawJSON) {
            reaction = ReactionLoader.loadReactionFromJSON(reactionRawJSON)

            console.log(reaction);
            

            this.setState({
                ...this.state,
                reaction: reaction
            })
        }

        // Create the p5 element
        if (window) {
            const createP5Sketch = (await import("../../../p5/Sketch")).default
            
            if (!reaction) throw new Error("reaction not loaded")
            createP5Sketch(this, reaction)
        }

    }

    togglePublication() {

        this.state.undoManager.addUndoPoint()
        
        this.state.reaction.published = !this.state.reaction.published

        this.forceUpdate()

        ReactionSaver.saveReaction(this.state.reaction)

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

    setCurrentStep(stepId: string) {
        let selectedStep: ReactionStep
        for (const step of this.state.reaction.steps) {
            if (step.uuid == stepId) selectedStep = step
        }
        this.state.reaction.currentStep = selectedStep
        ReactionSaver.saveReaction(this.state.reaction)
    }

    createNewStep() {
        const steps = this.state.reaction.steps
        const lastStep = steps[steps.length - 1]
        const lastStepJSON = JSON.stringify(lastStep)
        const newStep = ReactionStepLoader.loadReactionStepFromJSON(lastStepJSON)
        newStep.uuid = Utilities.generateUid()
        newStep.order += 1

        this.state.reaction.steps.push(newStep)
        this.state.reaction.currentStep = newStep

        this.forceUpdate()
        ReactionSaver.saveReaction(this.state.reaction)
    }

    deleteStep(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, stepId: string) {

        this.state.undoManager.addUndoPoint()

        let stepToDelete: ReactionStep | null = null

        // Get the step to delete
        for (const step of this.state.reaction.steps) {
            if (step.uuid == stepId) stepToDelete = step
        }

        if (stepToDelete == null)
            throw new Error("Could not find the stepToDelete")

        // Filter the step of out the list of steps
        this.state.reaction.steps =
            this.state.reaction.steps.filter(step => {
                return step != stepToDelete
            })
        
        // Reduce the order of the remaining steps
        for (const step of this.state.reaction.steps) {
            if (step.order > stepToDelete.order) {
                step.order -= 1
            }
        }

        if (this.state.reaction.currentStep == stepToDelete) {
            for (const step of this.state.reaction.steps) {
                if (step.order == stepToDelete.order - 1) {
                    this.state.reaction.currentStep = step
                }
            }
        }

        ReactionSaver.saveReaction(this.state.reaction)

        this.forceUpdate()

        event.stopPropagation()

    }

    setUndoManager(undoManager: UndoManager) {
        this.setState({
            ...this.state,
            undoManager: undoManager
        })
    }

    undo() {

        this.state.undoManager.undo()
        this.forceUpdate()

        // if (this.state.undoManager == null) {
        //     throw new Error("Undo manager has not been assigned")
        // }

        // const undoStackHead = this.state.undoManager.getUndoStackHead()
        // if (undoStackHead != null) {
        //     this.setState({
        //         ...this.state,
        //         reaction: undoStackHead
        //     })
        // }

        // this.state.undoManager.editorController.reaction.replaceWithNewModel(undoStackHead)

    }

    redo() {
        if (this.state.undoManager == null) {
            throw new Error("Undo manager has not been assigned")
        }
        this.state.undoManager.redo()
    }

    render() {

        const bondTypeButtons = Object.values(BondType).map(bondType => {
            return (
                <button 
                    className={this.state.bondType == bondType ? selectedButton : squareButton}
                    onClick={() => this.setBondType(bondType)}
                    key={bondType}
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
                <div 
                    className="rounded-full w-40 h-40 bg-gray-200"
                    key={element.abbreviation}
                >

                    <button
                        id={element.name}
                        onMouseDown={() => window.panelController.selectElement(element.name)}
                        onMouseUp={() => window.panelController.dropElement()}
                        style={{backgroundColor: element.color, cursor: "grab"}}
                        className="rounded-full w-40 h-40 text-white font-semibold text-md flex items-center justify-center z-10"
                    >
                        {element.abbreviation}
                    </button>

                </div>

            )
        })

        let listOfStepButtons: React.ReactNode
        if (this.state.reaction) {
            listOfStepButtons =   this.state.reaction.steps.map(step => (
                                        <li 
                                            onClick={() => this.setCurrentStep(step.uuid)}
                                            key={step.uuid}
                                            className={"group relative px-2 flex gap-1 items-center rounded-md  hover:bg-indigo-700 hover:text-white cursor-pointer " +
                                            (step.uuid === this.state.reaction.currentStep.uuid
                                                ? " text-white bg-indigo-700" : null)}
                                        >
                                            <span className="text-sm font-medium my-1">
                                                Step {step.order + 1}
                                            </span>
                                            <button
                                                onClick={(e) => this.deleteStep(e, step.uuid)}
                                                className={" invisible absolute top-0 right-0 text-indigo-300 bg-indigo-500 hover:text-white hover:bg-indigo-400 rounded-full p-0.5 " +
                                                    ((this.state.reaction.steps.length > 1) ? " group-hover:visible" : null)}
                                                style={{transform: "translate(40%, -40%)"}}
                                            >
                                                    <XIcon className="w-3 h-3" />
                                            </button>
                                        </li>
                                    ))
        }
        else {
            listOfStepButtons = "Loading"
        }
                                

        return (

            <>
            <header className="bg-indigo-600">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 ">
                    <div className="flex flex-col justify-left border-b border-indigo-400">

                        <Link href={"/editor/modules/" + this.state.reaction?.moduleId}>
                            <a className="text-indigo-200 hover:text-white text-xs font-light mt-3 mb-2 flex items-center gap-1">
                            <ArrowLeftIcon className="w-3 h-3" />
                            Module name goes here | Section name
                            </a>
                        </Link>


                        <div className="w-full flex flex-row justify-between mb-3">
                            <div>
                                <h1 className="text-2xl font-semibold text-white">
                                    Reaction name goes here
                                </h1>
                            </div>

                            <div className="flex flex-row gap-6 items-center">

                                <button className="text-sm text-white">
                                    Preview
                                </button>

                                <div className="flex flex-row gap-2 items-center">
                                    <div className="text-white text-sm">
                                        Publish
                                    </div>

                                    <Switch
                                            checked={this.state.physicsOn}
                                            onChange={() => this.togglePublication()}
                                            className={
                                                (this.state.reaction?.published ? 'bg-green-300 ' : 'bg-gray-200 ') +
                                                'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200'
                                            }
                                            >
                                            <span className="sr-only">Toggle publication of this reaction</span>
                                            <span
                                                aria-hidden="true"
                                                className={
                                                    (this.state.reaction?.published ? 'translate-x-5 ' : 'translate-x-0 ') + 
                                                    'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                                                }
                                            />
                                    </Switch>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </header>

            <div className="min-h-screen bg-gray-100">
                <div className="bg-indigo-600 pb-32">

                    <div className="py-5">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-row gap-4 items-center ">
                            <nav>
                                <ol className="rounded-md flex gap-2 text-indigo-400 ">
                                    {listOfStepButtons}
                                </ol>
                            </nav>
                            <button
                                onClick={() => this.createNewStep()}
                                className="text-indigo-100 hover:text-white text-sm flex flex-row"
                            >
                                <PlusIcon className="w-5 h-5" />
                                Add step
                            </button>
                        </div>
                    </div>
                </div>
            
                <main className="-mt-32">
                    <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8 flex flex-row gap-5">

                        {/* Various buttons */}
                        <div className="bg-white rounded-lg shadow p-5 flex flex-col gap-2 h-full">
                            
                                {bondTypeButtons}

                                <hr className="my-2"></hr>

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

                                <hr className="my-2"></hr>

                                <button
                                    className={this.state.eraserOn ? selectedButton : squareButton}
                                    onClick={() => this.toggleEraser()}
                                >
                                    <img className={buttonImage} src="/assets/images/eraser.svg" alt="eraser" />
                                </button>

                                {/* Undo */}
                                <button
                                    onClick={() => this.undo()}
                                    className={squareButton}
                                    // add in logic to trigger the undo
                                >
                                    <RotateCcw className="w-3.5 h-3.5"/>
                                </button>

                                {/* Redo */}
                                <button
                                    onClick={() => this.redo()}
                                    className={squareButton}
                                    // add logic to trigger the redo
                                >
                                    <RotateCw className="w-3.5 h-3.5" />
                                </button>
                            </div>

                        {/* p5 canvas */}
                        <div id="p5-canvas" className="bg-white rounded-lg shadow flex-grow">
                            <div className=" p-5 absolute flex flex-row items-center gap-2 text-sm text-gray-500">
                                Physics
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

                        {/* atomic elements */}
                        <div className="bg-white p-5 rounded-lg shadow flex flex-col gap-2 h-full">
                            {listOfAtomicElements}
                        </div>
                    
                    </div>

                    {/* <!-- Eraser highlight --> */}
                    <div id="eraser-tip" style={{visibility: "hidden"}} className="text-xs bg-gray-400 text-white rounded-sm shadow px-2 py-1 font-light absolute " >
                        Delete
                    </div>
                </main>
            </div>
            </>
        )
    }

}

export default withRouter(ReactionEditor)
export { ReactionEditor }