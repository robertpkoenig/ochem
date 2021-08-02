import React, { FormEvent, FormEventHandler, MouseEventHandler, SyntheticEvent, useState } from "react";
import Module from "../../model/Module";
import { primaryButtonMd } from "../../styles/common-styles";
import PopupBackground from "../PopupBackground";

interface IProps {
    module: Module
    popupCloseFunction: () => void
    updateModuleFunction: (moduleName: string, moduleSubtitle: string) => void
}

export default function ModuleRenamePopup(props: IProps) {

    const [moduleTitle, setModuleTitle] = useState(props.module.title)
    const [moduleSubtitle, setModuleSubtitle] = useState(props.module.subtitle)

    function onModuleNameChange(event: FormEvent<HTMLInputElement>) {
        setModuleTitle(event.currentTarget.value)
    }

    function onModuleSubtitleChange(event: FormEvent<HTMLInputElement>) {
        setModuleSubtitle(event.currentTarget.value)
    }

    function onSubmit(event: React.FormEvent) {
        event.preventDefault();
        props.updateModuleFunction(moduleTitle, moduleSubtitle)
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
                            value={moduleTitle}
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
                <input
                    type="submit"
                    name="submit"
                    value="Save"
                    placeholder="Type module name here"
                    className={primaryButtonMd + "cursor-pointer"}
                />
                </div>
            </div>
            </form>
        </PopupBackground>
    )

}
