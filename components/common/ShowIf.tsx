import { ReactNode } from "react"

interface IProps {
    if: boolean,
    children: ReactNode
}

function ShowIf(props: IProps) {
    return (
        <>
            {props.if && props.children}
        </>
    )
}

export default ShowIf