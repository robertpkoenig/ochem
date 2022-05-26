import { ReactNode } from "react"

interface IProps {
    condition: boolean,
    children: ReactNode
}

function ShowIf(props: IProps) {
    return (
        <>
            {props.condition && props.children}
        </>
    )
}

export default ShowIf