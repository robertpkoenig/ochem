import React, { FormEvent, FormEventHandler, MouseEventHandler, SyntheticEvent, useState } from "react";
import { primaryButtonMd } from "../../styles/common-styles";
import PopupBackground from "../PopupBackground";

interface IProps {
    popupCloseFunction: () => void
    moduleAdditionFunction: (string: string) => void
}

export default function ModulePopup(props: IProps) {

    const [moduleName, setModuleName] = useState('')

    function onModuleNameChange(event: FormEvent<HTMLInputElement>) {
        setModuleName(event.currentTarget.value)
    }

    function onSubmit(event: React.FormEvent) {
        event.preventDefault();
        props.moduleAdditionFunction(moduleName)
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
                        Module name
                    </label>
                    <input
                        type="text"
                        name="module-name"
                        placeholder="Type module name here"
                        value={moduleName}
                        onChange={onModuleNameChange}
                        id="module-name"
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                    </div>

                </div>
                </div>
                <div className="px-4 py-3 bg-gray-100 text-right sm:px-6">
                <input
                    type="submit"
                    name="submit"
                    value="Create Module"
                    placeholder="Type module name here"
                    className={primaryButtonMd + "cursor-pointer"}
                />
                </div>
            </div>
            </form>
        </PopupBackground>
    )

}
