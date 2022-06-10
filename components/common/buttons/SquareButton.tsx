import { ReactNode } from "react"
import classNames from "../../../functions/helper/classNames"
import ShowIf from "../ShowIf"

// Square buttons on the left panel of the editor screen
interface IProps {
    imageSrc?: string,
    imageAltText?: string,
    onMouseDown: () => void,
    selected: boolean,
    children?: ReactNode,
}

function SquareButton(props: IProps) {
    return (
        <button 
            className={classNames(
                'text-white bg-indigo-600 rounded-md pointer w-8 h-8 flex justify-center items-center hover:bg-indigo-700',
                props.selected && 'bg-indigo-700 ring-2 ring-offset-2 ring-indigo-500'
            )}
            onMouseDown={props.onMouseDown}
        >
            {props.children}
            <ShowIf condition={props.imageSrc != null}>
                <img
                className='w-4 h-4'
                src={props.imageSrc}
                alt={props.imageAltText}
                />
            </ShowIf>
        </button> 
    )
}

export default SquareButton