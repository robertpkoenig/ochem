import { ReactNode } from "react"

interface IProps {
    text: ReactNode
}

export default function EmptyState(props: IProps) {

    return (
        <div className="h-20 border-2 border-gray-200 border-dashed rounded-lg text-gray-400 font-light flex flex-col place-content-center items-center">
            {props.text}
        </div>
    )

}