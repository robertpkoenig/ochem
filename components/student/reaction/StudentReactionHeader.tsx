import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline"
import { ArrowLeftIcon } from "@heroicons/react/24/solid"
import Link from "next/link"
import Reaction from "../../../canvas/model/Reaction"

interface IProps {
    reaction: Reaction
    togglePopup: () => void
}

function StudentReactionHeader(props: IProps) {
    return (
        <header className="py-4">
            <div className="w-1200 mx-auto">
                <div className="flex flex-col gap-0 justify-left">
                    <div className="flex justify-between items-center text-gray-500 text-xs font-light">
                      <Link href={"/student/modules/" + props.reaction?.moduleId}>
                          <a className=" flex gap-1 items-center hover:text-indigo-700">
                              <ArrowLeftIcon className="w-3 h-3" />
                              {props.reaction?.moduleName + " | " + props.reaction?.sectionName}
                          </a>
                      </Link>
                      <button 
                        onClick={props.togglePopup}
                        className="text-gray-600 hover:text-indigo-800 flex gap-1 items-center"
                      >
                        <QuestionMarkCircleIcon className="w-3 h-3" />
                        Help
                      </button>
                    </div>
                    <div className="w-full flex flex-row justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-700">
                                { props.reaction?.name }
                            </h1>
                            <h2 className="text-sm font-normal text-gray-700">
                                { props.reaction?.description }
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </header> 
    )
}

export default StudentReactionHeader