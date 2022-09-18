import { Fragment as div } from "react"
import Reaction from "../../../canvas/model/Reaction"
import PopupBackground from "../../common/PopupBackground"
import Show from "../../common/Show"

interface IProps {
  reaciton: Reaction
  togglePopup: () => void
}


const HelpPopup = (props: IProps) => {

  const hintText = (
    <div className="bg-gray-100 rounded-md py-2 px-3">
      <h3 className="text-gray-800 font-semibold">
        Hint From The Lecturer
      </h3>
      <p className="whitespace-pre-line">
        {props.reaciton.hint}
      </p>
    </div>
  )

  const generalInstructions = (
    <div className="bg-gray-100 rounded-md py-2 px-3">
      <h3 className="text-gray-800 font-semibold">
        General Instructions
      </h3>
      <p>
        You must draw the correct arrows to complete the reaction. <br />
        To draw a curly arrow, click-drag from one or bond to another. <br />
      </p>
    </div>
  )

  return (
    <PopupBackground popupCloseFunction={props.togglePopup}>
      <div className="flex flex-col bg-white shadow rounded-md py-3 px-4">
        <div className="pb-2 text-lg font-semibold">
          Help
        </div>
        <div className="w-[700px] flex flex-col gap-2 rounded-sm">
          <Show if={props.reaciton.hint.length > 0}>
            {hintText}
          </Show>
          {generalInstructions}
        </div>
      </div>
    </PopupBackground> 
  )
}

export default HelpPopup