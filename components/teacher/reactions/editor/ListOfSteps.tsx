import { PlusIcon, XIcon } from "@heroicons/react/solid"
import classNames from "../../../../functions/helper/classNames"
import { IPageState } from "../../../../pages/teacher/reactions/[reactionId]"
import ShowIf from "../../../common/ShowIf"

interface IProps {
    state: IPageState,
    currentStepUid: string,
    setCurrentStep: (stepUid: string) => void,
    deleteStep: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, stepUid: string) => void,
    createStep: () => void,
}

function ListOfSteps(props: IProps) {

    function setCurrentStep(stepUid: string) {
        props.setCurrentStep(stepUid)
    }

    function createNewStep() {
        props.createStep()
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
                    onMouseDown={(e) => props.deleteStep(e, step.uuid)}
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
                onMouseDown={() => createNewStep()}
                className="text-indigo-100 hover:text-white text-sm flex flex-row"
            >
                <PlusIcon className="w-5 h-5" />
                Add step
            </button>
        </div>
    )
}

export default ListOfSteps