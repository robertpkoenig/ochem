import PopupBackground from "../../common/PopupBackground"

interface IProps {
  togglePopup: () => void
}

const IntroPopup = (props: IProps) => {
  return (
    <PopupBackground popupCloseFunction={props.togglePopup}>
      <div className="flex flex-col bg-white shadow rounded-md p-2">
        <div className=" text-center pb-2 text-lg font-semibold">
          Instructions
        </div>
        <div className="w-[700px] h-[400px]">
            <div className="bg-indigo-50 h-full w-full">
                <iframe
                    src="https://www.loom.com/embed/f9cb6644afcd4545808693d90757ef1a"
                    allowFullScreen={true}
                    className="z-10 w-full h-full"
                />
            </div>
        </div>
      </div>
    </PopupBackground> 
  )
}

export default IntroPopup