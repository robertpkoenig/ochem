import { Switch } from "@headlessui/react"
import { ArrowLeftIcon, PlusIcon, XIcon } from "@heroicons/react/solid"
import { GetServerSideProps } from "next"
import Link from "next/link"
import { MinusCircle, PlusCircle, RotateCcw, RotateCw } from "react-feather"
import Constants from "../../../p5/Constants"
import TeacherController from "../../../p5/controller/teacher/TeacherController"
import ReactionSaver from "../../../p5/controller/teacher/ReactionSaver"
import { AtomicElements } from "../../../p5/model/chemistry/atoms/elements"
import BondType from "../../../p5/model/chemistry/bonds/BondType"
import { ArrowType } from "../../../p5/model/chemistry/CurlyArrow"
import Reaction from "../../../p5/model/Reaction"
import ReactionStep from "../../../p5/model/ReactionStep"
import UserType from "../../../p5/model/UserType"
import ReactionLoader from "../../../p5/utilities/ReactionLoader"
import ReactionStepLoader from "../../../p5/utilities/ReactionStepLoader"
import Utilities from "../../../p5/utilities/Utilities"
import { doc, FirebaseFirestore, getDoc, getFirestore, setDoc, updateDoc } from "firebase/firestore"
import FirebaseConstants from "../../../firebase/FirebaseConstants"
import { PencilIcon } from "@heroicons/react/outline"
import PromptPopup from "../../../components/editor/PromptPopup"
import ReactionRenamePopup from "../../../components/editor/ReactionRenamePopup"
import ScreenWithLoadingAllRender from "../../../components/ScreenWithLoadingAllRender"
import Ion from "../../../p5/model/chemistry/atoms/Ion"
import p5 from "p5"
import { Component } from "react"

const panel = `rounded-md shadow p-5 bg-white flex items-center justify-between w-96`
const buttonGrid = `flex flex-row gap-2`
const squareButton = `text-white bg-indigo-600 rounded-md pointer w-8 h-8 flex justify-center items-center hover:bg-indigo-700 `
const selectedButton = squareButton + "bg-indigo-700 ring-2 ring-offset-2 ring-indigo-500 "
const buttonImage = "w-4 h-4"

// This function is used within server side rendering to get the 
// reaction ID from the url path
export const getServerSideProps: GetServerSideProps = async (context) => {
    return {
        props: {
            reactionId: context.params.reactionId
        }, // will be passed to the page component as props
    }
}

interface IProps {
    reactionId: string
}

interface IState {
    loading: boolean
    reaction: Reaction
    attractionOn: boolean
    repulsionOn: boolean
    bondType: BondType
    arrowType: ArrowType
    straightArrowSelected: boolean
    angleControlSelected: boolean
    selectedIon: Ion
    eraserOn: boolean
    teacherController: TeacherController
    selectedElement: HTMLElement
    promptPopupVisible: boolean
    renamePopupVisible: boolean
    p5: p5
}

// This is the page where the teacher edits exercises
// The reaction is loaded from firebase using the reaction
// Id in the URL path. On each edit action, the reaction is
// serialized to JSON, and that JSON is sent to Firebase
// to overwrite the existing reaction document.

class TeacherReactionPage extends Component<IProps, IState> {

    db: FirebaseFirestore

    constructor(props: IProps) {

        super(props)

        this.db = getFirestore()

        this.state = {
            loading: true,
            reaction: null,
            attractionOn: false,
            repulsionOn: false,
            bondType: null,
            arrowType: null,
            straightArrowSelected: false,
            angleControlSelected: false,
            selectedIon: null,
            eraserOn: false,
            teacherController: null,
            selectedElement: null,
            promptPopupVisible: false,
            renamePopupVisible: false,
            p5: null,
        }

    }

    // This function is called when this component is loaded in the browser.
    async componentDidMount() {

        const docRef = doc(this.db, FirebaseConstants.REACTIONS, this.props.reactionId);
        const docSnap = await getDoc(docRef);

        const rawReactionObject = docSnap.data()

        const reaction = ReactionLoader.loadReactionFromObject(rawReactionObject)

        this.setState({
            ...this.state,
            reaction: reaction
        })

        // Create the p5 element
        if (window) {
            
            const createP5Context = (await import("../../../p5/Sketch")).default
            
            if (!reaction) throw new Error("reaction not loaded")
            createP5Context(this, UserType.TEACHER, reaction)

            this.setState(prevState => {
                return {
                    ...prevState,
                    loading: false
                }
            })
        }

    }

    // This is called by the p5 setup function to inject the p5 object
    // into this component's state
    setP5(p5: p5) {
        this.setState(
            {
               ...this.state,
               p5: p5
            }
        )
    }

    // This function is called when this component is removed
    // from the browser window. It removes the p5 object from
    // the window, and therefore stops the p5 draw loop.
    componentWillUnmount() {
        this.state.p5.remove()
    }

    // This function toggles whether or not a reaction is visible
    // to students.
    toggleVisibility() {
        this.state.teacherController.undoManager.addUndoPoint()
        this.state.reaction.visible = !this.state.reaction.visible
        this.forceUpdate()
        ReactionSaver.saveReaction(this.state.reaction)

        // Update the core reaction document in firestore
        const reactionDocRef = doc(this.db, FirebaseConstants.REACTIONS, this.props.reactionId)
        updateDoc(reactionDocRef, {
            visible: this.state.reaction.visible
        })
        
        // Module doc ref to access the nested reaction listing object
        const moduleDocRef = doc(this.db, FirebaseConstants.MODULES, this.state.reaction.moduleId)

        // To update the reaction listing document in firestore,
        // the string detailing the document's nested location is
        // constructed here
        const reactionRefWithinSection =
            FirebaseConstants.SECTIONS + "."+ this.state.reaction.sectionId + "."+
            FirebaseConstants.REACTION_LISTINGS + "." + this.state.reaction.uuid + 
            "." + FirebaseConstants.VISIBLE

        const sectionVisibilityUpdateObject: any = {}
        sectionVisibilityUpdateObject[reactionRefWithinSection] = this.state.reaction.visible
        updateDoc(moduleDocRef, sectionVisibilityUpdateObject)
    }

    // This shows/hides the popup in which the user can edit
    // the reaction's prompt text
    togglePromptPopup() {
        this.setState(prevState => {
            return {
                ...prevState,
                promptPopupVisible: !prevState.promptPopupVisible
            }
        })
    }

    // This shows/hides the popup in which the user can
    // rename the reaction
    toggleReactionRenamePopup() {
        this.setState(prevState => {
            return {
                ...prevState,
                renamePopupVisible: !prevState.renamePopupVisible
            }
        })
    }

    renameReaction(newName: string) {
        this.state.reaction.name = newName
        this.forceUpdate()
        const reactionRef = doc(this.db, FirebaseConstants.REACTIONS, this.state.reaction.uuid)
        updateDoc(reactionRef, {
            name: newName
        })

        // Module doc ref to access the nested reaction listing object
        const moduleDocRef = doc(this.db, FirebaseConstants.MODULES, this.state.reaction.moduleId)

        // Update the reaction listing document in firestore
        const reactionRefWithinSection =
            FirebaseConstants.SECTIONS + "."+ this.state.reaction.sectionId + "."+
            FirebaseConstants.REACTION_LISTINGS + "." + this.state.reaction.uuid + 
            "." + FirebaseConstants.NAME

        const sectionVisibilityUpdateObject: any = {}
        sectionVisibilityUpdateObject[reactionRefWithinSection] = newName
        updateDoc(moduleDocRef, sectionVisibilityUpdateObject)
    }

    setPromptText(promptText: string) {
        // if there is no prompt, and therefore prompt is being set
        // for the first time, then reset the canvas offsets

        const needToResetOffsets = !this.state.reaction.prompt || !promptText

        this.state.reaction.prompt = promptText
        this.forceUpdate()
        ReactionSaver.saveReaction(this.state.reaction)

        if (needToResetOffsets) {
            this.state.teacherController.panelController.setCanvasParent()
        }
    }

    toggleAttraction() {
        this.setState((prevState) => {
            return {
                ...prevState,
                attractionOn: !prevState.attractionOn,
                bondType: null,
                eraserOn: false,
                arrowType: null
            }
        })        
    }

    toggleRepulsion() {
        if (this.state.attractionOn) {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    repulsionOn: !prevState.repulsionOn,
                    bondType: null,
                    eraserOn: false,
                    arrowType: null
                }
            }) 
        }   
        else {
            alert("you must have attraction on to enable repulsion")
        }    
    }

    // Turns on and off the eraser.
    toggleEraser() {
        this.setState((prevState) => {
            return {
                ...prevState,
                eraserOn: !prevState.eraserOn,
                bondType: null,
                arrowType: null,
                straightArrowSelected: false,
                ionSelected: null,
                angleControlSelected: false,
            }
        })        
    }

    setBondType(bondType: BondType) {

        // If the bond type is already selected, and the user
        // is pressing this bond type button again, simply set
        // the bond type to null, as the user is turning off the
        // bond drawing altogether
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
                    eraserOn: false,
                    straightArrowSelected: false,
                    selectedIon: null,
                    angleControlSelected: false,
                }
            }) 
        }

    }

    setArrowType(arrowType: ArrowType) {

        // If the arrow type is already selected, and the user
        // is pressing this arrow type button again, simply set
        // the arrow type to null, as the user is turning off the
        // arrow drawing altogether
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
                    eraserOn: false,
                    straightArrowSelected: false,
                    angleControlSelected: false,
                    selectedIon: null,
                }
            }) 
        }
       
    }

    selectIon(ion: Ion) {

        // If the ion type is already selected, and the user
        // is pressing this ion type button again, simply set
        // the ion type to null, as the user is turning off the
        // ion drawing altogether
        if (this.state.selectedIon == ion) {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    selectedIon: null
                }
            })  
        }

        else {
            this.setState(prevState => {
                return {
                    ...prevState,
                    selectedIon: ion,
                    eraserOn: false,
                    bondType: null,
                    arrowType: null,
                    straightArrowSelected: false,
                    angleControlSelected: false,
                }
            })
        }

    }

    toggleStraightArrow() {
        this.setState(prevState => {
            return {
                ...prevState,
                straightArrowSelected: !prevState.straightArrowSelected,
                eraserOn: false,
                bondType: null,
                selectedIon: null,
                arrowType: null,
                angleControlSelected: false,
            }
        })
    }

    // Sets the step object currently active in the editor canvas
    setCurrentStep(stepId: string) {
        let selectedStep: ReactionStep
        for (const step of this.state.reaction.steps) {
            if (step.uuid == stepId) selectedStep = step
        }
        this.state.reaction.currentStep = selectedStep
        ReactionSaver.saveReaction(this.state.reaction)
        this.forceUpdate()
    }

    // Copies the contents of the last step in the reaction,
    // minus the curly arrow, into a new step
    createNewStep() {
        // Copy the last step into a new step
        const steps = this.state.reaction.steps
        const lastStep = steps[steps.length - 1]
        
        const lastStepJSON = lastStep.toJSON()
        // console.log(lastStepJSON);
        
        const newStep = ReactionStepLoader.loadReactionStepFromPlainObject(lastStepJSON)
        newStep.curlyArrow = null
        newStep.uuid = Utilities.generateUid()
        newStep.order += 1

        this.state.reaction.steps.push(newStep)
        this.state.reaction.currentStep = newStep

        this.forceUpdate()
        ReactionSaver.saveReaction(this.state.reaction)
    }

    deleteStep(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, stepId: string) {

        this.state.teacherController.undoManager.addUndoPoint()

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

    // This is called by the downstream 'Controller' classe
    // to associate this component with that controller.
    // This allows events from this component to be routed
    // to that controller class
    setController(editorController: TeacherController) {
        this.setState({
            ...this.state,
            teacherController: editorController
        })
    }

    undo() {
        this.state.teacherController.undoManager.undo()
        this.forceUpdate()
    }

    redo() {
        this.state.teacherController.undoManager.redo()
        this.forceUpdate()
    }

    render() {

        // Creates the list of bond type buttons on the left panel of the screen
        const bondTypeButtons = Object.values(BondType).map(bondType => {
            return (
                <button 
                    className={this.state.bondType == bondType ? selectedButton : squareButton}
                    onMouseDown={() => this.setBondType(bondType)}
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

        // Creates the list of atomic elements on the right panel of the screen
        const listOfAtomicElements = Object.values(AtomicElements).map(element => {
            return (

                // Logic around the dummy element should be deleted
                element.name == "dummy"
                ?
                null
                :
                // This is the background to the atom which acts as the empty state
                // when the element is dragged onto the canvas
                <div 
                    className="rounded-full w-40 h-40 bg-gray-200"
                    key={element.abbreviation}
                >

                    <button
                        id={element.name}
                        onMouseDown={() => this.state.teacherController.panelController.selectElement(element.name)}
                        onMouseUp={() => this.state.teacherController.panelController.dropElement()}
                        style={{backgroundColor: element.color, cursor: "grab"}}
                        className="rounded-full w-40 h-40 text-white font-semibold text-md flex items-center justify-center z-10"
                    >
                        {element.abbreviation}
                    </button>

                </div>

            )
        })

        // This creates the list of buttons used to display and select
        // the reaction step currently active in the editor
        let listOfStepButtons: React.ReactNode
        if (this.state.reaction) {
            listOfStepButtons =   this.state.reaction.steps.map(step => (
                                        <li 
                                            onMouseDown={() => this.setCurrentStep(step.uuid)}
                                            key={step.uuid}
                                            className={"group relative px-2 flex gap-1 items-center rounded-md  hover:bg-indigo-700 hover:text-white cursor-pointer " +
                                            (step === this.state.reaction.currentStep
                                                ? " text-white bg-indigo-700" : null)}
                                        >
                                            <span className="text-sm font-medium my-1">
                                                Step {step.order + 1}
                                            </span>
                                            <button
                                                onMouseDown={(e) => this.deleteStep(e, step.uuid)}
                                                className={" invisible absolute top-0 right-0 text-indigo-300 bg-indigo-500 hover:text-white hover:bg-indigo-400 rounded-full p-0.5 " +
                                                    ((this.state.reaction.steps.length > 1) ? " group-hover:visible" : null)}
                                                style={{transform: "translate(40%, -40%)"}}
                                            >
                                                    <XIcon className="w-2 h-2" />
                                            </button>
                                        </li>
                                    ))
        }
        else {
            listOfStepButtons = "Loading"
        }
                                
        return (
            <ScreenWithLoadingAllRender loading={this.state.loading}>
                <>
                {/* Top header above the thin white horizontal rule
                    including the reaction name and the back link to the module page */}
                <header className="bg-indigo-600">
                    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 ">
                        <div className="flex flex-col justify-left border-b border-indigo-400">
                            <Link href={"/teacher/modules/" + this.state.reaction?.moduleId}>
                                <a className="text-indigo-200 hover:text-white text-xs font-light mt-3 mb-2 flex items-center gap-1">
                                    <ArrowLeftIcon className="w-3 h-3" />
                                    {
                                        this.state.reaction
                                        ?
                                        this.state.reaction.moduleName + " | " + this.state.reaction.sectionName
                                        :
                                        null
                                    }
                                </a>
                            </Link>
                            <div className="w-full flex flex-row justify-between mb-3">
                                <div className="flex gap-2 items-center">
                                    <h1 className="text-2xl font-semibold text-white">
                                        {this.state.reaction ? this.state.reaction.name : null}
                                    </h1>
                                    <PencilIcon
                                        onMouseDown={this.toggleReactionRenamePopup.bind(this)}
                                        className="w-4 h-4 text-indigo-400 hover:text-indigo-100 cursor-pointer"
                                    />
                                </div>
                                <div className="flex flex-row gap-6 items-center">
                                    <Link href={"/student/reactions/" + this.props.reactionId}>
                                        <a className="text-sm text-white">
                                          Preview
                                        </a>
                                    </Link>
                                    <div className="flex flex-row gap-2 items-center">
                                        <div className="text-white text-sm">
                                            Publish
                                        </div>
                                        <Switch
                                                checked={this.state.reaction?.visible}
                                                onChange={() => this.toggleVisibility()}
                                                className={
                                                    (this.state.reaction?.visible ? 'bg-green-300 ' : 'bg-gray-200 ') +
                                                    'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200'
                                                }
                                                >
                                                <span className="sr-only">Toggle publication of this reaction</span>
                                                <span
                                                    aria-hidden="true"
                                                    className={
                                                        (this.state.reaction?.visible ? 'translate-x-5 ' : 'translate-x-0 ') +
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

                {/* Element containing the reaction prompt and the list of steps */}
                <div className="min-h-screen bg-gray-100">
                    <div className="bg-indigo-600 pb-32">
                        <div className="py-5">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-3 ">
                                {
                                this.state.reaction && this.state.reaction.prompt
                                ?
                                <div className="flex flex-row items-baseline justify-between">
                                    <div className="flex flox-row items-center gap-1">
                                        <div className="text-indigo-100 text-md">
                                            {this.state.reaction.prompt}
                                        </div>
                                        <PencilIcon
                                            className="text-indigo-400 w-4 h-4 hover:text-indigo-100 cursor-pointer"
                                            onMouseDown={() => this.togglePromptPopup()}
                                        />
                                    </div>
                                    <div
                                        onMouseDown={() => this.setPromptText(null)}
                                        className="text-indigo-300 text-sm cursor-pointer hover:text-indigo-100">
                                        Remove prompt
                                    </div>
                                </div>
                                :
                                null
                                }
                
                                <div className="flex flex-row justify-between">
                                    <div className="flex flex-row gap-4 items-center">
                                        <nav className="flex flex-row items-center">
                                            <ol className="rounded-md flex gap-2 text-indigo-400 ">
                                                {listOfStepButtons}
                                            </ol>
                                        </nav>
                                        <button
                                            onMouseDown={() => this.createNewStep()}
                                            className="text-indigo-100 hover:text-white text-sm flex flex-row"
                                        >
                                            <PlusIcon className="w-5 h-5" />
                                            Add step
                                        </button>
                                    </div>
                                    {
                                    this.state.reaction && !this.state.reaction.prompt
                                    ?
                                    <div
                                        onMouseDown={() => this.togglePromptPopup()}
                                        className="text-indigo-300 text-sm cursor-pointer hover:text-indigo-100">
                                        + Add prompt
                                    </div>
                                    :
                                    null
                                    }
                                </div>
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
                                        onMouseDown={() => this.setArrowType(ArrowType.DOUBLE)}
                                    >
                                        <img className={buttonImage} src="/assets/images/curly_arrows/double.svg" alt="double curly arrow"  />
                                    </button>
                                    {/* Single curly arrow */}
                                    <button
                                        className={this.state.arrowType == ArrowType.SINGLE ? selectedButton : squareButton}
                                        onMouseDown={() => this.setArrowType(ArrowType.SINGLE)}
                                    >
                                        <img className={buttonImage} src="/assets/images/curly_arrows/single.svg" alt="single curly arrow" />
                                    </button>

                                    {/* Straight arrow */}
                                    <button
                                        className={this.state.straightArrowSelected ? selectedButton : squareButton}
                                        onMouseDown={() => this.toggleStraightArrow()}
                                    >
                                        <img className={buttonImage} src="/assets/images/straight-arrow.svg" alt="straight arrow" />
                                    </button>

                                    <hr className="my-2"></hr>

                                    {/* Plus */}
                                    <button
                                        className={this.state.selectedIon ==  Ion.CATION ? selectedButton : squareButton}
                                        onMouseDown={() => this.selectIon(Ion.CATION)}
                                    >
                                        <PlusCircle className="w-4 h-4" />
                                    </button>

                                    {/* Minus */}
                                    <button
                                        className={this.state.selectedIon ==  Ion.ANION ? selectedButton : squareButton}
                                        onMouseDown={() => this.selectIon(Ion.ANION)}
                                    >
                                        <MinusCircle className="w-4 h-4" />
                                    </button>

                                    <hr className="my-2"></hr>

                                    {/* Angle control */}
                                    {/* <button
                                        className={this.state.angleControlSelected ? selectedButton : squareButton}
                                        onMouseDown={() => this.toggleAngleControl()}
                                    >
                                        <img className={buttonImage} src="/assets/images/angle-control.svg" alt="eraser" />
                                    </button>

                                    <hr className="my-2"></hr> */}

                                    {/* Eraser */}
                                    <button
                                        className={this.state.eraserOn ? selectedButton : squareButton}
                                        onMouseDown={() => this.toggleEraser()}
                                    >
                                        <img className={buttonImage} src="/assets/images/eraser.svg" alt="eraser" />
                                    </button>

                                    {/* Undo */}
                                    <button
                                        onMouseDown={() => this.undo()}
                                        className={squareButton}
                                    >
                                        <RotateCcw className="w-3.5 h-3.5"/>
                                    </button>

                                    {/* Redo */}
                                    <button
                                        onMouseDown={() => this.redo()}
                                        className={squareButton}
                                    >
                                        <RotateCw className="w-3.5 h-3.5" />
                                    </button>

                                </div>
                            {/* p5 canvas */}
                            <div id={Constants.CANVAS_PARENT_NAME} className=" h-700 bg-white rounded-lg shadow flex-grow">
                                <div className=" p-5 absolute flex flex-row items-center gap-2 text-sm text-gray-500">
                                    Attraction
                                    <Switch
                                        checked={this.state.attractionOn}
                                        onChange={() => this.toggleAttraction()}
                                        className={
                                            (this.state.attractionOn ? 'bg-indigo-600 ' : 'bg-gray-200 ') +
                                            'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200'
                                        }
                                        >
                                        <span className="sr-only">Toggle attraction</span>
                                        <span
                                            aria-hidden="true"
                                            className={
                                                (this.state.attractionOn ? 'translate-x-5 ' : 'translate-x-0 ') +
                                                'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                                            }
                                    />
                                    </Switch>

                                    Repulsion
                                    <Switch
                                        checked={this.state.repulsionOn}
                                        onChange={() => this.toggleRepulsion()}
                                        className={
                                            (this.state.repulsionOn ? 'bg-indigo-600 ' : 'bg-gray-200 ') +
                                            'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200'
                                        }
                                        >
                                        <span className="sr-only">Toggle repulsion</span>
                                        <span
                                            aria-hidden="true"
                                            className={
                                                (this.state.repulsionOn ? 'translate-x-5 ' : 'translate-x-0 ') +
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
                        <div id="eraser-tip" style={{display: "none"}} className="text-xs bg-gray-400 text-white rounded-sm shadow px-2 py-1 font-light absolute " >
                            Delete
                        </div>
                    </main>
                </div>
                {/* Show prompt popup if visible */}
                {
                    this.state.promptPopupVisible
                    ?
                    <PromptPopup
                        popupCloseFunction={this.togglePromptPopup.bind(this)}
                        setPromptTextFunction={this.setPromptText.bind(this)}
                        initialText={this.state.reaction.prompt}
                    />
                    :
                    null
                }
                {/* Rename popup */}
                {
                    this.state.renamePopupVisible
                    ?
                    <ReactionRenamePopup
                        reaction={this.state.reaction}
                        popupCloseFunction={this.toggleReactionRenamePopup.bind(this)}
                        reameFunction={this.renameReaction.bind(this)}
                    />
                    :
                    null
                }
                </>
            </ScreenWithLoadingAllRender>
        )

    }

}

export default TeacherReactionPage
