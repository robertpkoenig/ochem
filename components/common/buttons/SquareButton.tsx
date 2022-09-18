import { ReactNode } from "react"
import classNames from "../../../functions/helper/classNames"
import Show from "../Show"

// Square buttons on the left panel of the editor screen
interface IProps {
    imageSrc?: string,
    imageAltText?: string,
    onMouseDown: () => void,
    selected: boolean,
    children?: ReactNode,
    tip: string
}

function SquareButton(props: IProps) {

    const tooltip = (
      <div className="bg-blue-700 shadow-md transform -translate-x-1/2 mr-12 rounded invisible group-hover:visible absolute flex items-center text-sm text-center font-light py-1 px-4 z-20">
          {props.tip}
          <div className=" w-4 h-4 fixed -right-2.5 overflow-hidden ">
              <div className=" w-4 h-4 bg-blue-700 rotate-45 transform origin-center -translate-x-1/2 rounded-sm"></div>
          </div>
      </div>
    )

    return (
        <button 
            className={classNames(
                'text-white bg-indigo-600 rounded-md pointer w-8 h-8 flex justify-center items-center hover:bg-indigo-700 group',
                props.selected && 'bg-indigo-700 ring-2 ring-offset-2 ring-indigo-500'
            )}
            onMouseDown={props.onMouseDown}
        >
            {tooltip}
            {props.children}
            <Show if={props.imageSrc != null}>
                <img
                    className='w-4 h-4'
                    src={props.imageSrc}
                    alt={props.imageAltText}
                />
            </Show>
        </button> 
    )
}

export default SquareButton