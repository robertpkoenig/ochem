import { PlusIcon, XIcon } from "@heroicons/react/solid"
import { isPropertySignature } from "typescript"
import ReactionSaver from "../../../../canvas/controller/teacher/helper/ReactionSaver"
import ReactionStep from "../../../../canvas/model/ReactionStep"
import ReactionStepLoader from "../../../../canvas/utilities/ReactionStepLoader"
import Utilities from "../../../../canvas/utilities/Utilities"
import classNames from "../../../../functions/helper/classNames"
import { ITeacherState } from "../../../../pages/teacher/reactions/[reactionId]"
import ShowIf from "../../../common/ShowIf"

interface IProps {
    state: ITeacherState
    setState: (state: ITeacherState) => void
}

function ListOfSteps(props: IProps) {


    // Sets the step object currently active in the editor canvas
    function setCurrentStep(stepId: string) {
        let selectedStep: ReactionStep
        for (const step of props.state.reaction.steps) {
            if (step.uuid == stepId) selectedStep = step
        }
        props.state.reaction.currentStep = selectedStep
        ReactionSaver.saveReaction(props.state.reaction)
        props.setState({...props.state, reaction: props.state.reaction})
    }

    // Copies the contents of the last step in the reaction,
    // minus the curly arrow, into a new step
    function createNewStep() {
        // Copy the last step into a new step
        const steps = props.state.reaction.steps
        const lastStep = steps[steps.length - 1]
        
        const lastStepJSON = lastStep.toJSON()
        

        const newStep = ReactionStepLoader.loadReactionStepFromPlainObject(lastStepJSON)
        
        newStep.uuid = Utilities.generateUid()
        newStep.order += 1

        props.state.reaction.steps.push(newStep)
        props.state.reaction.currentStep = newStep

        ReactionSaver.saveReaction(props.state.reaction) // THE PROBLEM IS HERE

        props.setState({...props.state, reaction: props.state.reaction})
    }

    function deleteStep(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, stepId: string) {

        props.state.controller.undoManager.addUndoPoint()

        let stepToDelete: ReactionStep | null = null

        // Get the step to delete
        for (const step of props.state.reaction.steps) {
            if (step.uuid == stepId) stepToDelete = step
        }

        if (stepToDelete == null)
            throw new Error("Could not find the stepToDelete")

        // Filter the step of out the list of steps
        props.state.reaction.steps =
            props.state.reaction.steps.filter(step => {
                return step != stepToDelete
            })
        
        // Reduce the order of the remaining steps
        for (const step of props.state.reaction.steps) {
            if (step.order > stepToDelete.order) {
                step.order -= 1
            }
        }

        if (props.state.reaction.currentStep == stepToDelete) {
            for (const step of props.state.reaction.steps) {
                if (step.order == stepToDelete.order - 1) {
                    props.state.reaction.currentStep = step
                }
            }
        }

        ReactionSaver.saveReaction(props.state.reaction)
        props.setState({...props.state, reaction: props.state.reaction})

        event.stopPropagation()

    }

    const listOfStepButtons =
        props.state.reaction?.steps.map(step => (
            <li 
                onMouseDown={() => setCurrentStep(step.uuid)}
                key={step.uuid}
                className={
                        classNames("group relative px-2 flex gap-1 items-center rounded-md  hover:bg-indigo-700 hover:text-white cursor-pointer", 
                        step === props.state.reaction.currentStep && "text-white bg-indigo-700")}
            >
                <span className="text-sm font-medium my-1">
                    Step {step.order + 1}
                </span>
                <button
                    onMouseDown={(e) => deleteStep(e, step.uuid)}
                    className={
                        classNames("invisible absolute top-0 right-0 text-indigo-300 bg-indigo-500 hover:text-white hover:bg-indigo-400 rounded-full p-0.5",
                        props.state.reaction.steps.length > 1 && "group-hover:visible")}
                    style={{transform: "translate(40%, -40%)"}}
                >
                    <XIcon className="w-2 h-2" />
                </button>
            </li>
        ))

    return (
        <div className="flex flex-row gap-4 items-center">
            <nav className="flex flex-row items-center">
                <ol className="rounded-md flex gap-2 text-indigo-400 ">
                    <ShowIf condition={props.state.reaction != null}>
                        {listOfStepButtons}
                    </ShowIf>
                </ol>
            </nav>
            <button
                onMouseDown={createNewStep}
                className="text-indigo-100 hover:text-white text-sm flex flex-row"
            >
                <PlusIcon className="w-5 h-5" />
                Add step
            </button>
        </div>
    )
}

export default ListOfSteps