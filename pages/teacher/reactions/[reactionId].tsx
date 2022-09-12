import { GetServerSideProps } from "next"
import ReactionSaver from "../../../canvas/controller/teacher/helper/ReactionSaver"
import BondType from "../../../canvas/model/chemistry/bonds/BondType"
import { ArrowType } from "../../../canvas/model/chemistry/CurlyArrow"
import Reaction from "../../../canvas/model/Reaction"
import UserType from "../../../canvas/model/UserType"
import ReactionLoader from "../../../canvas/utilities/ReactionLoader"
import { doc, getDoc, getFirestore } from "firebase/firestore"
import PromptPopup from "../../../components/teacher/reactions/editor/PromptPopup"
import ReactionRenamePopup from "../../../components/teacher/reactions/editor/ReactionRenamePopup"
import ScreenWithLoadingAllRender from "../../../components/common/ScreenWithLoadingAllRender"
import Ion from "../../../canvas/model/chemistry/atoms/Ion"
import p5 from "p5"
import { useEffect, useState } from "react"
import { CANVAS_PARENT_NAME } from "../../../canvas/Constants"
import { REACTIONS } from "../../../persistence-model/FirebaseConstants"
import EditorTopPanel from "../../../components/teacher/reactions/editor/EditorTopPanel"
import AtomicElements from "../../../components/teacher/reactions/editor/AtomicElements"
import EditorLeftButtons from "../../../components/teacher/reactions/editor/EditorLeftButtons"
import ListOfSteps from "../../../components/teacher/reactions/editor/ListOfSteps"
import ShowIf from "../../../components/common/ShowIf"
import Prompt from "../../../components/teacher/reactions/editor/Prompt"
import TeacherController from "../../../canvas/controller/teacher/TeacherController"

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
    controller: TeacherController,
    reaction: Reaction
    bondType: BondType
    arrowType: ArrowType
    straightArrowSelected: boolean
    angleControlSelected: boolean
    selectedIon: Ion
    lonePairSelected: boolean
    eraserOn: boolean
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

    const [state, setState] = 
        useState<IState>(() => (
            {
                controller: null,
                reaction: null,
                bondType: null,
                arrowType: null,
                straightArrowSelected: false,
                angleControlSelected: false,
                selectedIon: null,
                lonePairSelected: false,
                eraserOn: false,
                selectedElement: null,
                promptPopupVisible: false,
                renamePopupVisible: false,
                p5: null
            }))

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
            import("../../../canvas/TeacherP5Setup").then(module => {
                module.default(state, setP5, setController, state.reaction)
                setLoading(false)
            })
        }
        if (window && state.reaction && !state.p5) setupP5()
    }, [state.reaction])

    useEffect(() => {
        if (state?.controller) {    
            state.controller.pageState = state;
        }
    }, [state])

    // Removes p5 object from window when component dismounts
    // double arrow function means that the function is called on component dismount
    useEffect(() => () =>  state.p5?.remove(), [])

    function setP5(p5: p5) {
        setState({...state, p5: p5})
    }

    function setController(controller: TeacherController) {
        setState({...state, controller: controller})
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

    function setPromptText(promptText: string) {
        // if there is no prompt, and therefore prompt is being set
        // for the first time, then reset the canvas offsets

        const needToResetOffsets = !state.reaction.prompt || !promptText

        state.reaction.prompt = promptText

        ReactionSaver.saveReaction(state.reaction)
        setState({...state, reaction: state.reaction})

        if (needToResetOffsets) {
            state.controller.panelController.setCanvasParent()
        }
    }
                                
    return (
        <ScreenWithLoadingAllRender loading={loading}>

            <EditorTopPanel 
                state={state}
                setState={setState}
                toggleReactionRenamePopup={toggleReactionRenamePopup}
                db={db}
            />

            {/* Reaction prompt and the list of steps */}
            <div className="min-h-screen bg-gray-100">
                <div className="bg-indigo-600 pb-32">
                    <div className="py-5">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-3 ">
                            
                            <ShowIf if={!!state.reaction?.prompt}>
                                <Prompt 
                                    state={state} 
                                    togglePrompt={togglePromptPopup} 
                                    setPromptText={setPromptText}                                    
                                />
                            </ShowIf>
            
                            <div className="flex flex-row justify-between">

                                <ListOfSteps
                                    state={state}
                                    setState={setState}
                                />

                                <ShowIf if={state.reaction?.prompt == null}> 
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
                            state={state}
                            setState={setState}
                        />
                        {/* p5 canvas */}
                        <div id={CANVAS_PARENT_NAME} className="h-700 bg-white rounded-lg shadow flex-grow" />
                        <AtomicElements teacherController={state.controller} />
                    </div>

                    {/* Tooltip that shows over element when in 'eraser' mode */}
                    <div id="eraser-tip" style={{display: "none"}} className="text-xs bg-gray-400 text-white rounded-sm shadow px-2 py-1 font-light absolute " >
                        Delete
                    </div>

                </main>
            </div>

            <ShowIf if={state.promptPopupVisible}>
                <PromptPopup
                    popupCloseFunction={togglePromptPopup}
                    setPromptTextFunction={setPromptText}
                    initialText={state.reaction?.prompt}
                />
            </ShowIf>

            <ShowIf if={state.renamePopupVisible}>
                <ReactionRenamePopup
                    state={state}
                    setState={setState}
                    toggleReactionRenamePopup={toggleReactionRenamePopup}
                />
            </ShowIf>

        </ScreenWithLoadingAllRender>
    )

}

export type { IState as ITeacherState }
export default TeacherReactionPage
