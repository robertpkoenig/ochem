import { ReactNode } from "react"

interface IProps {
    condition: boolean,
    children: ReactNode
}

function ShowIfTrue(props: IProps) {
    return (
        <>
            {props.condition && props.children}
        </>
    )
}

export default ShowIfTrue