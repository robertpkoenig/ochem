import { ReactNode } from "react";
import LoadingScreen from "./LoadingScreen";

interface IProps {
    loading: boolean
    children: JSX.Element
}

export default function ScreenWithLoading(props: IProps) {

    const loadingScreen = <LoadingScreen />

    return (
        <>
        {props.loading?loadingScreen:null}
        {props.children}
        </>
    )

}