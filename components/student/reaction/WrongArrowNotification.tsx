import { XCircleIcon } from "@heroicons/react/solid"

function WrongArrowNotification() {
    return (
        <div className="absolute bottom-0 bg-pink-200 p-2 flex flex-row justify-center w-full rounded-b-md ">
            <div className="flex">
                <div className="flex-shrink-0">
                    <XCircleIcon className="h-5 w-5 text-pink-600" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-pink-600">Incorrect arrow</h3>
                </div>
            </div>
        </div>
    )
}

export default WrongArrowNotification