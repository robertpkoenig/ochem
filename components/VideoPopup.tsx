import PopupBackground from "./PopupBackground";

interface IProps {
    popupCloseFunction: () => void
}

export default function VideoPopup(props: IProps) {

    return (
        <PopupBackground popupCloseFunction={props.popupCloseFunction}>
            <div style={{width: "700px", height: "400px"}} className="w-96 h-96 bg-white shadow rounded-md p-2">
                <div className="bg-indigo-50 h-full w-full">
                    <iframe
                        src="https://www.loom.com/embed/f9cb6644afcd4545808693d90757ef1a"
                        // frameborder="0"
                        allowFullScreen={true}
                        // webkitAllowFullScreen={true}
                        className="w-full h-full"
                    />
                </div>
            </div>
        </PopupBackground>
    )

}