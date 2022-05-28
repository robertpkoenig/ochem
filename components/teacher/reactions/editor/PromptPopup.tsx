import React, { FormEvent, SyntheticEvent, useState } from "react";
import FormSubmitButton from "../../../common/buttons/FormSubmitButton";
import PopupBackground from "../../../common/PopupBackground";

interface IProps {
    popupCloseFunction: () => void
    setPromptTextFunction: (string: string) => void
    initialText: string
}

export default function PromptPopup(props: IProps) {

    const [promptText, setPromptText] = useState(props.initialText)

    function onModuleNameChange(event: FormEvent<HTMLInputElement>) {
        setPromptText(event.currentTarget.value)
    }

    function onSubmit(event: React.FormEvent) {
        event.preventDefault();
        props.setPromptTextFunction(promptText)
        props.popupCloseFunction()
    }

    function stopPropogation(event: SyntheticEvent) {
        event.stopPropagation()
    }

    return (
        <PopupBackground popupCloseFunction={props.popupCloseFunction}>
            <form onSubmit={onSubmit}>
                <div 
                    onClick={stopPropogation}
                    className="shadow overflow-hidden sm:rounded-md"
                >
                    <div className="px-4 py-5 bg-white sm:p-6">
                        <div className="flex flex-col gap-6">

                            <div className="w-96">
                            <label htmlFor="module-name" className="block text-sm font-medium text-gray-700">
                                Prompt text
                            </label>
                            <input
                                type="text"
                                name="module-name"
                                placeholder="Type module name here"
                                value={promptText}
                                onChange={onModuleNameChange}
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