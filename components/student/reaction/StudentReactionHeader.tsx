import { QuestionMarkCircleIcon } from "@heroicons/react/outline"
import { ArrowLeftIcon } from "@heroicons/react/solid"
import Link from "next/link"
import Reaction from "../../../canvas/model/Reaction"

interface IProps {
    reaction: Reaction
    togglePopup: () => void
}

function StudentReactionHeader(props: IProps) {
    return (
        <header className="bg-indigo-600">
            <div className="w-1200 mx-auto">
                <div className="flex flex-col justify-left border-b border-indigo-400">
                    <div className="flex justify-between items-center text-indigo-200 text-xs font-light mt-3 mb-2">
                      <Link href={"/student/modules/" + props.reaction?.moduleId}>
                          <a className=" flex gap-1 items-center hover:text-white">
                              <ArrowLeftIcon className="w-3 h-3" />
                              {props.reaction?.moduleName + " | " + props.reaction?.sectionName}
                          </a>
                      </Link>
                      <button 
                        onClick={props.togglePopup}
                        className="hover:text-white flex gap-1 items-center"
                      >
                        <QuestionMarkCircleIcon className="w-3 h-3" />
                        Instructions
                      </button>
                    </div>
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