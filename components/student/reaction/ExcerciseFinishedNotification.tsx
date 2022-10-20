import { CheckCircleIcon } from "@heroicons/react/24/solid"
import Link from "next/link"
import Reaction from "../../../canvas/model/Reaction"
import Button from "../../common/buttons/Button"

interface IProps {
    reaction: Reaction
    resetReaction: () => void
}

function ExcerciseFinishedNotification(props: IProps) {
    return (
        <div className="absolute top-0 bg-green-100 p-4 flex flex-row items-center justify-between w-full rounded-t-md ">
            <div className="flex">
                <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-5 w-5 text-green-700" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-700">Reaction completed!</h3>
                </div>
            </div>
            <div className="flex flex-row gap-4">

                {/* For some reason, retry button is flaky */}
                {/* <Button
                    size={'small'}
                    importance={'secondary'}
                    text={'Retry'}
                    icon={null}
                    onClick={() => location.reload()}
                    extraClasses={''}
                /> */}

                <Link href={"/student/modules/" + props.reaction?.moduleId}>
                    <a>
                        <Button
                            size={'small'}
                            importance={'primary'}
                            text={'Back to module'}
                            icon={null}
                            onClick={null}
                            extraClasses={''}
                        />
                    </a>
                </Link>

            </div>
        </div>
    )
}

export default ExcerciseFinishedNotification