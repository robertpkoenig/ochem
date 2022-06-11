import { ArrowLeftIcon } from "@heroicons/react/solid"
import Link from "next/link"
import Reaction from "../../../canvas/model/Reaction"

interface IProps {
    reaction: Reaction
}

function StudentReactionHeader(props: IProps) {
    return (
        <header className="bg-indigo-600">
            <div className="w-1200 mx-auto">
                <div className="flex flex-col justify-left border-b border-indigo-400">
                    <Link href={"/student/modules/" + props.reaction?.moduleId}>
                        <a className="text-indigo-200 hover:text-white text-xs font-light mt-3 mb-2 flex items-center gap-1">
                        <ArrowLeftIcon className="w-3 h-3" />
                            {props.reaction?.moduleName + " | " + props.reaction?.sectionName}
                        </a>
                    </Link>
                    <div className="w-full flex flex-row justify-between mb-3">
                        <div>
                            <h1 className="text-2xl font-semibold text-white">
                                { props.reaction?.name }
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
        </header> 
    )
}

export default StudentReactionHeader