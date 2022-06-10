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
import PromptPopup from "../../../components/teacher/reactions/editor/PromptPopup"
import ReactionRenamePopup from "../../../components/teacher/reactions/editor/ReactionRenamePopup"
import ScreenWithLoadingAllRender from "../../../components/common/ScreenWithLoadingAllRender"
import Ion from "../../../canvas/model/chemistry/atoms/Ion"
import p5 from "p5"
import { useEffect, useState } from "react"
import { CANVAS_PARENT_NAME } from "../../../canvas/Constants"
import { MODULES, NAME, REACTIONS, REACTION_LISTINGS, SECTIONS, VISIBLE } from "../../../persistence-model/FirebaseConstants"
import EditorTopPanel from "../../../components/teacher/reactions/editor/EditorTopPanel"
import AtomicElements from "../../../components/teacher/reactions/editor/AtomicElements"
import EditorLeftButtons from "../../../components/teacher/reactions/editor/EditorLeftButtons"
import ListOfSteps from "../../../components/teacher/reactions/editor/ListOfSteps"
import ShowIf from "../../../components/common/ShowIf"
import Prompt from "../../../components/teacher/reactions/editor/Prompt"
import { Controller } from "../../../canvas/controller/Controller"

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
    controller: Controller,
    reaction: Reaction
    bondType: BondType
    arrowType: ArrowType
    straightArrowSelected: boolean
    angleControlSelected: boolean
    ionSelected: Ion
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

const TeacherReactionPage = (props: IProps) => {

    const db = getFirestore()

    const [loading, setLoading] = useState<boolean>(true)

    const [state, setState] = useState<IState>(() => {
        console.log("set state function running")
        
    return {
        controller: null,
        reaction: null,
        bondType: null,
        arrowType: null,
        straightArrowSelected: false,
        angleControlSelected: false,
        ionSelected: null,
        eraserOn: false,
        teacherController: null,
        selectedElement: null,
        promptPopupVisible: false,
        renamePopupVisible: false,
        p5: null
    }})

    useEffect(() => {
        
        // load reaction from db
        getDoc(doc(db, REACTIONS, props.reactionId))
        .then(doc => {
            const reaction = ReactionLoader.loadReactionFromObject(doc.data())
            setState({...state, reaction: reaction})
        })

    }, [db, props.reactionId])

    useEffect(() => {
        async function setupP5() {
            import("../../../canvas/Sketch").then(module => {
                module.default(state, setState, UserType.TEACHER, state.reaction)
                setLoading(false)
            })
        }
        if (window && state.reaction && !state.p5) setupP5()
    }, [state.reaction])

    useEffect(() => {
        if (state?.controller) {
            console.log("controller state set function");
            
            state.controller.pageState = state;
            state.controller.teacherController.pageState = state;
        }
    }, [state])

    // This function is called when this component is removed
    // from the browser window. That's why it's a double arrow function.
    // It removes the p5 object from the window, and therefore stops the p5 draw loop.
    useEffect(() => () =>  state.p5?.remove(), [])

    // This function toggles whether or not a reaction is visible
    // to students.
    function toggleVisibility() {
        state.teacherController.undoManager.addUndoPoint()
        state.reaction.visible = !state.reaction.visible
        // forceUpdate()
        ReactionSaver.saveReaction(state.reaction)

        // Module doc ref to access the nested reaction listing object
        const moduleDocRef = doc(db, MODULES, state.reaction.moduleId)

        // To update the reaction listing document in firestore,
        // the string detailing the document's nested location is
        // constructed here
        const reactionRefWithinSection =
            SECTIONS + "."+ state.reaction.sectionId + "."+
            REACTION_LISTINGS + "." + state.reaction.uuid + 
            "." + VISIBLE

        const sectionVisibilityUpdateObject: any = {}
        sectionVisibilityUpdateObject[reactionRefWithinSection] = state.reaction.visible
        updateDoc(moduleDocRef, sectionVisibilityUpdateObject)

        setState({...state, reaction: state.reaction})
    }

    // This shows/hides the popup in which the user can edit
    // the reaction's prompt text
    function togglePromptPopup() {
        setState({...state, promptPopupVisible: !state.promptPopupVisible})
    }

    // This shows/hides the popup in which the user can
    // rename the reaction
    function toggleReactionRenamePopup() {
        setState({ ...state, renamePopupVisible: !state.renamePopupVisible })
    }

    function renameReaction(newName: string) {
        state.reaction.name = newName
        // forceUpdate()
        const reactionRef = doc(db, REACTIONS, state.reaction.uuid)
        updateDoc(reactionRef, {
            name: newName
        })

        // Module doc ref to access the nested reaction listing object
        const moduleDocRef = doc(db, MODULES, state.reaction.moduleId)

        // Update the reaction listing document in firestore
        const reactionRefWithinSection =
            SECTIONS + "."+ state.reaction.sectionId + "."+
            REACTION_LISTINGS + "." + state.reaction.uuid + 
            "." + NAME

        const sectionVisibilityUpdateObject: any = {}
        sectionVisibilityUpdateObject[reactionRefWithinSection] = newName
        updateDoc(moduleDocRef, sectionVisibilityUpdateObject)
    }

    function setPromptText(promptText: string) {
        // if there is no prompt, and therefore prompt is being set
        // for the first time, then reset the canvas offsets

        const needToResetOffsets = !state.reaction.prompt || !promptText

        state.reaction.prompt = promptText

        ReactionSaver.saveReaction(state.reaction)
        setState({...state, reaction: state.reaction})

        if (needToResetOffsets) {
            state.teacherController.panelController.setCanvasParent()
        }
    }

    // Turns on and off the eraser.
    function toggleEraser() {
        setState({
                ...state,
                eraserOn: !state.eraserOn,
                bondType: null,
                arrowType: null,
                straightArrowSelected: false,
                ionSelected: null,
                angleControlSelected: false,
            })        
    }

    function setBondType(bondType: BondType) {

        // If the bond type is already selected, and the user
        // is pressing this bond type button again, simply set
        // the bond type to null, as the user is turning off the
        // bond drawing altogether
        if (state.bondType == bondType) {
            setState({ ...state, bondType: null })  
        }

        else {
            setState({
                    ...state,
                    bondType: bondType,
                    arrowType: null,
                    eraserOn: false,
                    straightArrowSelected: false,
                    ionSelected: null,
                    angleControlSelected: false,
            }) 
        }

    }

    function setArrowType(arrowType: ArrowType) {

        // If the arrow type is already selected, and the user
        // is pressing this arrow type button again, simply set
        // the arrow type to null, as the user is turning off the
        // arrow drawing altogether
        if (state.arrowType == arrowType) {
            setState({ ...state, arrowType: null })  
        }

        else {
            setState({
                    ...state,
                    arrowType: arrowType,
                    bondType: null,
                    eraserOn: false,
                    straightArrowSelected: false,
                    angleControlSelected: false,
                    ionSelected: null,
            }) 
        }
       
    }

    function selectIon(ion: Ion) {

        // If the ion type is already selected, and the user
        // is pressing this ion type button again, simply set
        // the ion type to null, as the user is turning off the
        // ion drawing altogether
        if (state.ionSelected == ion) {
            setState({
                    ...state,
                    ionSelected: null
            })  
        }

        else {
            setState({
                    ...state,
                    ionSelected: ion,
                    eraserOn: false,
                    bondType: null,
                    arrowType: null,
                    straightArrowSelected: false,
                    angleControlSelected: false,
            })
        }

    }

    function toggleStraightArrow() {
        setState({
                ...state,
                straightArrowSelected: !state.straightArrowSelected,
                eraserOn: false,
                bondType: null,
                ionSelected: null,
                arrowType: null,
                angleControlSelected: false,
        })
    }

    // Sets the step object currently active in the editor canvas
    function setCurrentStep(stepId: string) {
        let selectedStep: ReactionStep
        for (const step of state.reaction.steps) {
            if (step.uuid == stepId) selectedStep = step
        }
        state.reaction.currentStep = selectedStep
        ReactionSaver.saveReaction(state.reaction)
        setState({...state, reaction: state.reaction})
    }

    // Copies the contents of the last step in the reaction,
    // minus the curly arrow, into a new step
    function createNewStep() {
        // Copy the last step into a new step
        const steps = state.reaction.steps
        const lastStep = steps[steps.length - 1]
        
        const lastStepJSON = lastStep.toJSON()
        // console.log(lastStepJSON);
        
        const newStep = ReactionStepLoader.loadReactionStepFromPlainObject(lastStepJSON)
        newStep.curlyArrow = null
        newStep.uuid = Utilities.generateUid()
        newStep.order += 1

        state.reaction.steps.push(newStep)
        state.reaction.currentStep = newStep

        ReactionSaver.saveReaction(state.reaction)

        setState({...state, reaction: state.reaction})
    }

    function deleteStep(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, stepId: string) {

        state.teacherController.undoManager.addUndoPoint()

        let stepToDelete: ReactionStep | null = null

        // Get the step to delete
        for (const step of state.reaction.steps) {
            if (step.uuid == stepId) stepToDelete = step
        }

        if (stepToDelete == null)
            throw new Error("Could not find the stepToDelete")

        // Filter the step of out the list of steps
        state.reaction.steps =
            state.reaction.steps.filter(step => {
                return step != stepToDelete
            })
        
        // Reduce the order of the remaining steps
        for (const step of state.reaction.steps) {
            if (step.order > stepToDelete.order) {
                step.order -= 1
            }
        }

        if (state.reaction.currentStep == stepToDelete) {
            for (const step of state.reaction.steps) {
                if (step.order == stepToDelete.order - 1) {
                    state.reaction.currentStep = step
                }
            }
        }

        ReactionSaver.saveReaction(state.reaction)
        setState({...state, reaction: state.reaction})

        event.stopPropagation()

    }

    function undo() {
        state.teacherController.undoManager.undo()
    }

    function redo() {
        state.teacherController.undoManager.redo()
    }
                                
    return (
        <ScreenWithLoadingAllRender loading={loading}>
            <>

            <EditorTopPanel 
                state={state}
                toggleReactionRenamePopup={toggleReactionRenamePopup}
                toggleVisibility={toggleVisibility}
            />

            {/* Reaction prompt and the list of steps */}
            <div className="min-h-screen bg-gray-100">
                <div className="bg-indigo-600 pb-32">
                    <div className="py-5">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-3 ">
                            
                            <ShowIf condition={!!state.reaction?.prompt}>
                                <Prompt 
                                    state={state} 
                                    togglePrompt={togglePromptPopup} 
                                    setPromptText={setPromptText}                                    
                                />
                            </ShowIf>
            
                            <div className="flex flex-row justify-between">

                                <ListOfSteps
                                    state={state}
                                    currentStepUid={state.reaction?.currentStep.uuid}
                                    setCurrentStep={setCurrentStep}
                                    deleteStep={deleteStep}
                                    createStep={ createNewStep}
                                />

                                <ShowIf condition={state.reaction?.prompt == null}> 
                                    <div
                                        onMouseDown={togglePromptPopup}
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
                            bondType={state.bondType}
                            setBondType={setBondType}
                            arrowType={state.arrowType}
                            setArrowType={setArrowType}
                            straightArrowSelected={state.straightArrowSelected}
                            toggleStraightArrowSelected={toggleStraightArrow}
                            selectedIon={state.ionSelected}
                            selectIon={selectIon}
                            eraserOn={state.eraserOn} 
                            toggleEraser={toggleEraser}
                            undo={undo}
                            redo={redo}
                        />
                            
                        {/* p5 canvas */}
                        <div id={CANVAS_PARENT_NAME} className=" h-700 bg-white rounded-lg shadow flex-grow">
                        </div>
                        
                        <AtomicElements teacherController={state.teacherController} />
            
                    </div>

                    {/* Tooltip that shows over element when in 'eraser' mode */}
                    <div id="eraser-tip" style={{display: "none"}} className="text-xs bg-gray-400 text-white rounded-sm shadow px-2 py-1 font-light absolute " >
                        Delete
                    </div>

                </main>
            </div>

            <ShowIf condition={state.promptPopupVisible}>
                <PromptPopup
                    popupCloseFunction={togglePromptPopup}
                    setPromptTextFunction={setPromptText}
                    initialText={state.reaction?.prompt}
                />
            </ShowIf>

            <ShowIf condition={state.renamePopupVisible}>
                <ReactionRenamePopup
                    state={state}
                    popupCloseFunction={toggleReactionRenamePopup}
                    reameFunction={renameReaction}
                />
            </ShowIf>

            </>
        </ScreenWithLoadingAllRender>
    )

}

export type { IState as IPageState }
export default TeacherReactionPage
