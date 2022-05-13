import { createElement } from "react"
import classNames from "../../../functions/helper/classNames"
import { iconSizeStyle, Importance, importanceStyles, Size, sizeStyles } from "./buttonStyling";

interface IProps {
    size: Size,
    importance: Importance,
    text: string,
    icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element,
    onClick: () => void,
    extraClasses: string
}

function Button(props: IProps) {

    const sizeStyling = sizeStyles[props.size]
    const importanceStyling = importanceStyles[props.importance]

    return (
        <button
            onClick={props.onClick} 
            className={
                classNames(
                    props.extraClasses,
                    "inline-flex items-center disabled:cursor-default",
                    sizeStyling,
                    importanceStyling)}
        >
            {createElement(props.icon, {className: classNames(iconSizeStyle[props.size])})}
            {props.text}
        </button>
    )
}

export default Button