import { XIcon } from '@heroicons/react/outline'
import { SyntheticEvent } from 'react'

interface IProps {
    children: React.ReactNode
    popupCloseFunction: () => void
}

export default function PopupBackground(props: IProps) {

    function stopPropogation(event: SyntheticEvent) {
        event.stopPropagation()
    }

    return (

        <div 
            className="fixed z-10 top-0 left-0 w-screen h-screen bg-gray-400 bg-opacity-70 flex place-content-center place-items-center"
            onClick={props.popupCloseFunction}
        >
            <div className="flex flex-col gap-2 ">

                <div className="flex flex-row-reverse ">
                    <button 
                      className="bg-white w-10 h-10 rounded-full shadow flex place-content-center place-items-center transition-all text-gray-400 hover:text-gray-600"
                    >
                        <XIcon className="h-5 w-5"/>
                    </button>
                </div>

                <div onClick={stopPropogation}>
                    {props.children}
                </div>

            </div>
            
        </div>

    )

}