import { Switch } from "@headlessui/react"
import { ArrowLeftIcon, PencilIcon } from "@heroicons/react/solid"
import Link from "next/link"
import Reaction from "../../canvas/model/Reaction"

interface IProps {
    reaction?: Reaction,
    toggleReactionRenamePopup: () => void,
    toggleVisibility: () => void,
}

function EditorTopPanel(props: IProps) {

    const linkBackToModule =
        <Link href={"/teacher/modules/" + props.reaction?.moduleId}>
            <a className="text-indigo-200 hover:text-white text-xs font-light mt-3 mb-2 flex items-center gap-1">
                <ArrowLeftIcon className="w-3 h-3" />
                { props.reaction && props.reaction.moduleName + " | " + props.reaction.sectionName }
            </a>
        </Link>

    const reactionNameAndEditButton =
        <div className="flex gap-2 items-center">
            <h1 className="text-2xl font-semibold text-white">
                {props.reaction ? props.reaction.name : null}
            </h1>
            <PencilIcon
                onMouseDown={props.toggleReactionRenamePopup}
                className="w-4 h-4 text-indigo-400 hover:text-indigo-100 cursor-pointer"
            />
        </div>
    
    const linkToPreviewReactionInStudentPage =
        <Link href={"/student/reactions/" + props.reaction?.uuid}>
            <a className="text-sm text-white">
            Preview
            </a>
        </Link>

    const toggleForWhetherStudentsCanViewThisReaction =
        <div className="flex flex-row gap-2 items-center">
            <div className="text-white text-sm">
                Publish
            </div>
            <Switch
                    checked={props.reaction?.visible}
                    onChange={() => props.toggleVisibility()}
                    className={
                        (props.reaction?.visible ? 'bg-green-300 ' : 'bg-gray-200 ') +
                        'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200'
                    }
                    >
                    <span className="sr-only">Toggle publication of this reaction</span>
                    <span
                        aria-hidden="true"
                        className={
                            (props.reaction?.visible ? 'translate-x-5 ' : 'translate-x-0 ') +
                            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                        }
                    />
            </Switch>
        </div>

    return (
        <header className="bg-indigo-600">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 ">
                <div className="flex flex-col justify-left border-b border-indigo-400">
                    {linkBackToModule}
                    <div className="w-full flex flex-row justify-between mb-3">
                        {reactionNameAndEditButton}
                        <div className="flex flex-row gap-6 items-center">
                            {linkToPreviewReactionInStudentPage}
                            {toggleForWhetherStudentsCanViewThisReaction}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default EditorTopPanel