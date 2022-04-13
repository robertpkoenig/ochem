import LoadingScreen from "./LoadingScreen";

interface IProps {
    loading: boolean
    children: JSX.Element
}

/**
 * Shows the loading screen if the loading prop is true,
 * otherwise it shows the child components (the page content)
 */
export default function ScreenWithLoading(props: IProps) {

    const loadingScreen = <LoadingScreen />

    return (
        <>
            {props.loading?loadingScreen:props.children}
        </>
    )

}