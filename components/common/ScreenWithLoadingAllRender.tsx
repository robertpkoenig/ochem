import LoadingScreen from "./LoadingScreen";
import ShowIf from "./ShowIf";

interface IProps {
    loading: boolean,
    children: React.ReactNode
}

/** 
 * Shows a loading screen when the loading prop is false.
 * But it does render other content behind the loading popup.
 * This is used for the p5 page because p5 needs to access the canvas
 * HTML element during initialization.
 */
export default function ScreenWithLoadingAllRender(props: IProps) {

    return (
        <>
        <ShowIf condition={props.loading}>
            <LoadingScreen />
        </ShowIf>
        
        {props.children}
        </>
    )

}