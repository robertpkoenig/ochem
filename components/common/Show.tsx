import { ReactNode } from "react"

interface IProps {
    if: boolean,
    children: ReactNode
}

function Show(props: IProps) {
    return (
        <>
            {props.if && props.children}
        </>
    )
}

export default Show