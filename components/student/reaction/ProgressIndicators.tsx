import Reaction from "../../../canvas/model/Reaction"
import classNames from "../../../functions/helper/classNames"
import ShowIf from "../../common/ShowIf"

interface IProps {
    reaction: Reaction
}

function ProgressIndicators(props: IProps) {
    return (
        <div className="flex flex-row gap-3 ">
            <div className="text-xs font-medium">
                Progress
            </div>
            <ol className="rounded-md flex gap-2 text-indigo-400 ">
                {props.reaction?.steps.map(step => 
                    <li 
                        key={step.uuid}
                        className="relative flex items-center justify-center"
                    >
                        <ShowIf if={step == props.reaction?.currentStep}>
                            <span className="absolute w-5 h-5 p-px flex" aria-hidden="true">
                                <span className="w-full h-full rounded-full bg-indigo-200 animate-pulse" />
                            </span>
                        </ShowIf>

                        <span className={classNames("relative w-2.5 h-2.5 rounded-full", 
                            step.order > props.reaction?.currentStep.order ? " bg-gray-300 " : "bg-indigo-600")} />
                    </li>
                )}
            </ol>
        </div>  
    )
}

export default ProgressIndicators