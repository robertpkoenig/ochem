import { CheckCircleIcon, ClipboardIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Button from "../../../common/buttons/Button";
import PopupBackground from "../../../common/PopupBackground";

interface IProps {
    popupCloseFunction: () => void
    moduleId: string
}

export default function SharePopup(props: IProps) {

    const [copyConfirmVis, setCopyConfirmVis] = useState(false)

    function copyLinkText() {
        navigator.clipboard.writeText(window.location.hostname + "/student/invitation/" + props.moduleId)
        setCopyConfirmVis(true)
        setTimeout(function() {
            setCopyConfirmVis(false)
        }, 1000)
    }

    // This is a dummy 'onChange' handler for the input below to silence warnings
    function doNothing() {}

    return (
        <PopupBackground popupCloseFunction={props.popupCloseFunction}>
            <div className="shadow rounded-md flex flex-col gap-3 px-6 py-6 bg-white">

                <div className="flex flex-row justify-between items-center gap-1 font-bold text-lg text-indigo-600">
                    <div>
                        Share
                    </div>
                    
                    <div className="text-green-500 text-sm font-normal flex gap-1 items-center">
                        {
                            copyConfirmVis &&
                            <>
                                <CheckCircleIcon className="w-4 h-4" />
                                Copied
                            </>
                        }
                    </div>
                </div>

                <div>
                    <p className="font-light text-gray-500">
                        Send this link to students. They can then access the module.
                    </p>
                </div>

                <div className="flex flex-row gap-2 ">
                    <input
                        onChange={doNothing}
                        id="linkText"
                        className="font-light border border-gray-300 rounded-md text-gray-700 flex-grow"
                        type="text"
                        value={window.location.hostname + "/student/invitation/" + props.moduleId}
                    />
                    <Button
                        size={"medium"}
                        importance={"primary"}
                        text={"Copy Link"}
                        icon={ClipboardIcon}
                        onClick={copyLinkText}
                        extraClasses={"w-auto"}
                    />
                </div>

            </div>
        </PopupBackground>
    )
}