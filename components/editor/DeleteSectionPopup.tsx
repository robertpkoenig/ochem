import Section from "../../firebase/SectionListing"
import { redButtonMd } from "../../styles/common-styles"
import PopupBackground from "../PopupBackground"

interface IProps {
    section: Section
    deleteSectionFunction: () => void
    toggleDeleteSectionPopup: () => void
}

function DeleteSectionPopup(props: IProps) {

    function deleteSectionAndClosePopup() {
        props.deleteSectionFunction()
        props.toggleDeleteSectionPopup()
    }

    return (
        <PopupBackground 
            popupCloseFunction={props.toggleDeleteSectionPopup}
        >
            <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Delete section
                    </h3>
                    <div className="mt-2 max-w-xl text-sm text-gray-500">
                        <p>You are about to delete:</p>
                        <p><b>{props.section.name}</b></p>
                        <p>Once you delete it, it will be permenantly lost</p>
                    </div>
                    <div className="mt-5">
                        <button
                            onClick={() => deleteSectionAndClosePopup()}
                            type="button"
                            className={redButtonMd}
                        >
                            Delete section
                        </button>
                    </div>
                </div>
            </div>
        </PopupBackground>
    )
}

export default DeleteSectionPopup