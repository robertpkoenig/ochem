import { ClipboardCopyIcon, PaperAirplaneIcon } from "@heroicons/react/outline";
import { SyntheticEvent } from "react";
import { primaryButtonMd, primaryButtonSm } from "../../styles/common-styles";
import PopupBackground from "../PopupBackground";

interface IProps {
    popupCloseFunction: () => void
    moduleId: string
}

export default function SharePopup(props: IProps) {

    function stopPropogation(event: SyntheticEvent) {
        event.stopPropagation()
    }

    function copyLinkText() {
        const linkText: HTMLInputElement = document.getElementById("linkText") as HTMLInputElement
        linkText.select()
        linkText.setSelectionRange(0, 9999)
        document.execCommand("copy")
    }

    // This is a dummy 'onChange' handler for the input below to silence warnings
    function doNothing() {}

    return (
        <PopupBackground popupCloseFunction={props.popupCloseFunction}>
            <div
                onClick={stopPropogation}
                className="shadow rounded-md flex flex-col gap-3 px-6 py-6 bg-white"
            >
                <div className="flex flex-row items-center gap-1 font-bold text-lg text-indigo-600">
                    Share
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
                        value={window.location.hostname + "/student/invitiation/" + props.moduleId}
                    />
                    <button
                        className={primaryButtonMd + "w-auto"}
                        onClick={copyLinkText}
                    >
                        <ClipboardCopyIcon className="-ml-0.5 mr-2 h-5 w-5" aria-hidden="true" />
                        Copy link
                    </button>
                </div>

            </div>
        </PopupBackground>
    )
}