import { Transition } from "@headlessui/react"
import { CheckCircleIcon } from "@heroicons/react/24/solid"
import { IStudentState } from "../../../pages/student/reactions/[reactionId]"

interface IProps {
    successToastVis: boolean
}

function CorrectArrowNotification(props: IProps) {
    return (
        <Transition
            show={props.successToastVis}
            enter="transition-opacity duration-75"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div className="ml-2 bg-green-200 py-1.5 pl-3 pr-4 flex flex-row gap-2 justify-center rounded-md">
                <div>
                    <CheckCircleIcon className="h-5 w-5 text-green-600" aria-hidden="true" />
                </div>
                <div>
                    <h3 className="text-sm font-medium text-green-600">Correct arrow</h3>
                </div>
            </div>
        </Transition>    
          
    )
}

export default CorrectArrowNotification