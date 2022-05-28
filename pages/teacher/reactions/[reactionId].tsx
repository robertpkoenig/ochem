import { PlusIcon, XIcon } from "@heroicons/react/solid"
import { GetServerSideProps } from "next"
import TeacherController from "../../../canvas/controller/teacher/TeacherController"
import ReactionSaver from "../../../canvas/controller/teacher/helper/ReactionSaver"
import BondType from "../../../canvas/model/chemistry/bonds/BondType"
import { ArrowType } from "../../../canvas/model/chemistry/CurlyArrow"
import Reaction from "../../../canvas/model/Reaction"
import ReactionStep from "../../../canvas/model/ReactionStep"
import UserType from "../../../canvas/model/UserType"
import ReactionLoader from "../../../canvas/utilities/ReactionLoader"
import ReactionStepLoader from "../../../canvas/utilities/ReactionStepLoader"
import Utilities from "../../../canvas/utilities/Utilities"
import { doc, FirebaseFirestore, getDoc, getFirestore, setDoc, updateDoc } from "firebase/firestore"
import { PencilIcon } from "@heroicons/react/outline"
import PromptPopup from "../../../components/teacher/reactions/editor/PromptPopup"
import ReactionRenamePopup from "../../../components/teacher/reactions/editor/ReactionRenamePopup"
import ScreenWithLoadingAllRender from "../../../components/common/ScreenWithLoadingAllRender"
import Ion from "../../../canvas/model/chemistry/atoms/Ion"
import p5 from "p5"
import { Component } from "react"
import { CANVAS_PARENT_NAME } from "../../../canvas/Constants"
import { MODULES, NAME, REACTIONS, REACTION_LISTINGS, SECTIONS, VISIBLE } from "../../../persistence-model/FirebaseConstants"
import EditorTopPanel from "../../../components/teacher/reactions/editor/EditorTopPanel"
import AtomicElements from "../../../components/teacher/reactions/editor/AtomicElements"
import EditorLeftButtons from "../../../components/teacher/reactions/editor/EditorLeftButtons"
import ListOfSteps from "../../../components/teacher/reactions/editor/ListOfSteps"
import ShowIf from "../../../components/common/ShowIf"

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

// *** This NEEDS to be a class component :( otherwise p5 will not work ***

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

        // Load reaction from db
        const docRef = doc(this.db, REACTIONS, this.props.reactionId);
        const docSnap = await getDoc(docRef);
        const rawReactionObject = docSnap.data()
        const reaction = ReactionLoader.loadReactionFromObject(rawReactionObject)
        this.setState({
            ...this.state,
            reaction: reaction
        })

        // Create the p5 element
        if (window) {
            
            const createP5Context = (await import("../../../canvas/Sketch")).default
            
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

        // Module doc ref to access the nested reaction listing object
        const moduleDocRef = doc(this.db, MODULES, this.state.reaction.moduleId)

        // To update the reaction listing document in firestore,
        // the string detailing the document's nested location is
        // constructed here
        const reactionRefWithinSection =
            SECTIONS + "."+ this.state.reaction.sectionId + "."+
            REACTION_LISTINGS + "." + this.state.reaction.uuid + 
            "." + VISIBLE

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
        const reactionRef = doc(this.db, REACTIONS, this.state.reaction.uuid)
        updateDoc(reactionRef, {
            name: newName
        })

        // Module doc ref to access the nested reaction listing object
        const moduleDocRef = doc(this.db, MODULES, this.state.reaction.moduleId)

        // Update the reaction listing document in firestore
        const reactionRefWithinSection =
            SECTIONS + "."+ this.state.reaction.sectionId + "."+
            REACTION_LISTINGS + "." + this.state.reaction.uuid + 
            "." + NAME

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
                                
        return (
            <ScreenWithLoadingAllRender loading={this.state.loading}>
                <>

                <EditorTopPanel 
                    reaction={this.state.reaction}
                    toggleReactionRenamePopup={this.toggleReactionRenamePopup.bind(this)}
                    toggleVisibility={this.toggleVisibility.bind(this)}
                />

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
                                    <ListOfSteps
                                        reaction={this.state.reaction}
                                        currentStepUid={this.state.reaction?.currentStep.uuid}
                                        setCurrentStep={this.setCurrentStep.bind(this)}
                                        deleteStep={this.deleteStep.bind(this)}
                                        createStep={ this.createNewStep.bind(this)}
                                    />

                                    <ShowIf condition={this.state.reaction?.prompt != null}> 
                                        <div
                                            onMouseDown={() => this.togglePromptPopup()}
                                            className="text-indigo-300 text-sm cursor-pointer hover:text-indigo-100">
                                            + Add prompt
                                        </div>
                                    </ShowIf>

                                </div>
                            </div>
                        </div>
                    </div>
                
                    <main className="-mt-32">
                        <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8 flex flex-row gap-5">

                            <EditorLeftButtons 
                                bondType={this.state.bondType}
                                setBondType={this.setBondType.bind(this)}
                                arrowType={this.state.arrowType}
                                setArrowType={this.setArrowType.bind(this)}
                                straightArrowSelected={this.state.straightArrowSelected}
                                toggleStraightArrowSelected={this.toggleStraightArrow.bind(this)}
                                selectedIon={this.state.selectedIon}
                                selectIon={this.selectIon.bind(this)}
                                eraserOn={this.state.eraserOn} 
                                toggleEraser={this.toggleEraser.bind(this)}
                                undo={this.undo.bind(this)}
                                redo={this.redo.bind(this)}
                            />
                                
                            {/* p5 canvas */}
                            <div id={CANVAS_PARENT_NAME} className=" h-700 bg-white rounded-lg shadow flex-grow">
                            </div>
                            
                            <AtomicElements teacherController={this.state.teacherController} />
                
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
