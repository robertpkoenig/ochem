import { Switch } from "@headlessui/react"
import { ArrowLeftIcon, PlusIcon } from "@heroicons/react/solid"
import Link from "next/link"
import { NextRouter, withRouter } from "next/router"
import React from "react"
import LocalStorageReaction from "../../../model/LocalStorageReaction"
import { AtomicElements } from "../../../p5/model/chemistry/atoms/elements"
import BondType from "../../../p5/model/chemistry/bonds/BondType"
import { ArrowType } from "../../../p5/model/chemistry/CurlyArrow"
import Reaction from "../../../p5/model/Reaction"

const panel = `rounded-md shadow p-5 bg-white flex items-center justify-between w-96`
const buttonGrid = `flex flex-row gap-2`
const squareButton = `bg-indigo-600 rounded-sm pointer w-8 h-8 flex justify-center items-center hover:bg-indigo-700 `
const selectedButton = squareButton + "bg-indigo-700 ring-2 ring-offset-2 ring-indigo-500 "
const buttonImage = "w-4 h-4"

const steps = [
    { id: '01', name: 'Job details', href: '#', status: 'complete' },
    { id: '02', name: 'Application form', href: '#', status: 'current' },
    { id: '03', name: 'Preview', href: '#', status: 'upcoming' },
]

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
}

class ReactionEditorOld extends React.Component<IProps, IState> {

    constructor(props: IProps) {

        super(props)

        const reactionId = this.props.router.query.reactionId

        this.state = {
            reaction: null,
            reactionId: reactionId as string,
            physicsOn: false,
            eraserOn: false,
            bondType: null,
            arrowType: null
        }

    }

   
    componentDidMount() {

        // Add logic to redirect if uuid of reaction is missing

        const reactionFromLocalStorageString: string | null = localStorage.getItem(this.state.reactionId)
        if (reactionFromLocalStorageString) {
            const reaction: Reaction = JSON.parse(reactionFromLocalStorageString)

            this.setState({
                ...this.state,
                reaction: reaction
            })
        }

        // Create the p5 element

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
                <div className="rounded-full w-10 h-10 bg-gray-200">

                    <button
                        style={{backgroundColor: element.color, cursor: "grab"}}
                        className="rounded-full w-10 h-10 text-white font-semibold text-md flex items-center justify-center z-10"
                    >
                        {element.abbreviation}
                    </button>

                </div>

            )
        })

        return (

            <>
            <header className="bg-indigo-600">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 ">
                    <div className="flex flex-col justify-left border-b border-indigo-400">

                        <Link href="#">
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
                                            onChange={() => this.togglePhysics()}
                                            className={
                                                (this.state.physicsOn ? 'bg-green-600 ' : 'bg-gray-200 ') +
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
                                    {steps.map((step, stepIdx) => (
                                    <li 
                                        key={step.name}
                                        className={"relative px-1 py-0 rounded-md hover:bg-indigo-700 hover:text-white" +
                                        (step.status === 'current' ? " text-white bg-indigo-800" : "")}
                                    >
                                        <button className="px-2 py-1 flex items-center text-sm font-medium">
                                            Step {stepIdx + 1}
                                        </button>
                                    </li>
                                    ))}
                                </ol>
                            </nav>
                            <button className="text-indigo-100 hover:text-white text-sm flex flex-row">
                                <PlusIcon className="w-5 h-5" />
                                Add step
                            </button>
                        </div>
                    </div>
                </div>
            
                <main className="-mt-32">
                    <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8 flex flex-row gap-5">

                        {/* Various buttons */}
                        <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6 flex flex-col gap-2 h-full">
                            
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

                            <hr className="my-2"></hr>

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

                        </div>

                        {/* p5 canvas */}
                        <div id="editor-canvas" className="bg-white rounded-lg shadow px-5 py-6 sm:px-6 flex-grow">
                        </div>

                        {/* atomic elements */}
                        <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6 flex flex-col gap-2 flex-grow-0">
                            {listOfAtomicElements}
                        </div>
                    
                    </div>
                </main>
            </div>
            </>
      )
    }

}

export default withRouter(ReactionEditorOld)