import React, { FormEvent, FormEventHandler, MouseEventHandler, SyntheticEvent, useState } from "react";
import FormSubmitButton from "../common/buttons/FormSubmitButton";
import PopupBackground from "../PopupBackground";

interface IProps {
    popupCloseFunction: () => void
    moduleAdditionFunction: (moduleName: string, moduleSubtitle: string) => void
}

export default function ModulePopup(props: IProps) {

    const [moduleName, setModuleName] = useState('')
    const [moduleSubtitle, setModuleSubtitle] = useState('')

    function onModuleNameChange(event: FormEvent<HTMLInputElement>) {
        setModuleName(event.currentTarget.value)
    }

    function onModuleSubtitleChange(event: FormEvent<HTMLInputElement>) {
        setModuleSubtitle(event.currentTarget.value)
    }

    function onSubmit(event: React.FormEvent) {
        event.preventDefault();
        props.moduleAdditionFunction(moduleName, moduleSubtitle)
        props.popupCloseFunction()
    }

    function stopPropogation(event: SyntheticEvent) {
        event.stopPropagation()
    }

    return (
        <PopupBackground popupCloseFunction={props.popupCloseFunction}>
            <form onSubmit={onSubmit}>
            <div className="shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 bg-white sm:p-6">
                <div className="flex flex-col gap-6">

                    <div className="w-96">
                        <h2 className="w-full text-center font-bold mb-4">
                            New Module
                        </h2>
                        <label htmlFor="module-name" className="block text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <input
                            type="text"
                            name="module-name"
                            placeholder="Title"
                            value={moduleName}
                            onChange={onModuleNameChange}
                            id="module-name"
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                        <label htmlFor="module-name" className="mt-4 block text-sm font-medium text-gray-700">
                            Subtitle (optional)
                        </label>
                        <input
                            type="text"
                            name="module-subtitle"
                            placeholder="Subtitle (optional)"
                            value={moduleSubtitle}
                            onChange={onModuleSubtitleChange}
                            id="module-subtitle"
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                    </div>

                </div>
                </div>
                <div className="px-4 py-3 bg-gray-100 text-right sm:px-6">
                <FormSubmitButton value={"Create Module"} class={""} />
                </div>
            </div>
            </form>
        </PopupBackground>
    )

}
