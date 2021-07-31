import { XIcon } from '@heroicons/react/outline'

interface IProps {
    children: React.ReactNode
    popupCloseFunction: () => void
}

// TODO make this not scroll with the page
const popupCSS = ` absolute top-0 left-0 w-screen h-screen bg-gray-400
                  bg-opacity-70 flex place-content-center place-items-center`

const closeButtonCSS = `bg-white w-10 h-10 rounded-full shadow flex 
                        place-content-center place-items-center transition-all
                        text-gray-400 hover:text-gray-600`    

export default function PopupBackground(props: IProps) {

    return (

        <div 
        className={popupCSS}
        onClick={props.popupCloseFunction}
        >
            <div className="flex flex-col gap-2 ">

                <div className="flex flex-row-reverse ">
                    <button className={closeButtonCSS} onClick={props.popupCloseFunction}>
                        <XIcon className="h-5 w-5"/>
                    </button>
                </div>

                {props.children}

            </div>
        </div>

    )

}