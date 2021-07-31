import { PaperAirplaneIcon } from "@heroicons/react/outline";
import { SyntheticEvent } from "react";
import PopupBackground from "../PopupBackground";

interface IProps {
    popupCloseFunction: () => void
    moduleId: string
}

export default function SharePopup(props: IProps) {

    function stopPropogation(event: SyntheticEvent) {
        
    }

    return (
        <PopupBackground popupCloseFunction={props.popupCloseFunction}>
            <div className="shadow rounded-md flex flex-col gap-2 px-6 py-4 bg-white">
                <div className="flex flex-row items-center gap-1 font-bold text-lg text-indigo-600">
                    <PaperAirplaneIcon className="w-5 h-5"/>
                    Share
                </div>
                <div>
                    <p className="font-light ">
                        Send this link to students, and they will able to sign up, and view module content
                    </p>
                </div>
                <div className="w-96 h-10 border overflow-scroll p-2">
                <p className="font-light text-gray-500 overflow-scroll">
                    {window.location.hostname + "/student/invitiation/" + props.moduleId}
                </p>
                </div>

            </div>
        </PopupBackground>
    )
}