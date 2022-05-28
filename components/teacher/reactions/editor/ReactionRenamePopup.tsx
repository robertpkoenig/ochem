import React, { FormEvent, SyntheticEvent, useState } from "react";
import Reaction from "../../../../canvas/model/Reaction";
import FormSubmitButton from "../../../common/buttons/FormSubmitButton";
import PopupBackground from "../../../common/PopupBackground";

interface IProps {
    reaction: Reaction
    popupCloseFunction: () => void
    reameFunction: (reactionName: string) => void
}

export default function ReactionRenamePopup(props: IProps) {

    const [reactionName, setReactionName] = useState<string>(props.reaction.name)

    function onReactionNameChange(event: FormEvent<HTMLInputElement>) {
        setReactionName(event.currentTarget.value)
    }

    function onSubmit(event: React.FormEvent) {
        event.preventDefault();
        props.reameFunction(reactionName)
        props.popupCloseFunction()
    }

    function stopPropagation(event: SyntheticEvent) {
        event.stopPropagation()
    }

    return (
        
        <PopupBackground
            popupCloseFunction={props.popupCloseFunction} 
        >
            <form onSubmit={onSubmit}>
                <div
                    onClick={stopPropagation}
                    className="shadow overflow-hidden sm:rounded-md"
                >
                <div className="px-4 py-5 bg-white sm:p-6">
                    <div className="flex flex-col gap-6">
                    <div className="w-96">
                        <label htmlFor="module-name" className="block text-sm font-medium text-gray-700">
                            Reaction name
                        </label>
                        <input
                        type="text"
                        name="module-name"
                        value={reactionName}
                        placeholder="Type reaction name here"
                        onChange={onReactionNameChange}
                        id="module-name"
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                    </div>
                    </div>
                </div>
                <div className="px-4 py-3 bg-gray-100 text-right sm:px-6">
                    <FormSubmitButton value={"Save"} class={""} />
                </div>
                </div>
            </form>
        </PopupBackground>

    )

}
