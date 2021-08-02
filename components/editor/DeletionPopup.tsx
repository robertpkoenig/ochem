import ModuleListing from "../../model/ModuleListing"
import ReactionListing from "../../model/ReactionListing"
import Section from "../../model/SectionListing"
import { redButtonMd } from "../../styles/common-styles"
import PopupBackground from "../PopupBackground"

interface IProps {
    thing: ReactionListing | ModuleListing | Section
    thingType: string
    deletionFunction: () => void
    togglePopupFunction: () => void
}

// I have both delete the reaction listing (filter it out)
// and delete the reaction itself from the database
function DeletionPopup(props: IProps) {

    function deleteReactionAndClosePopup() {
        props.deletionFunction()
        props.togglePopupFunction()
    }

    return (
        <PopupBackground
            popupCloseFunction={props.togglePopupFunction}
        >
            <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Delete {props.thingType}
                    </h3>
                    <div className="mt-2 max-w-xl text-sm text-gray-500">
                        <p>You are about to delete:</p>
                        <p><b>{props.thing.name}</b></p>
                        <br></br>
                        <p>Once you delete it, it will be permenantly lost</p>
                    </div>
                    <div className="mt-5">
                        <button
                            onClick={() => deleteReactionAndClosePopup()}
                            type="button"
                            className={redButtonMd}
                        >
                            Delete {props.thingType}
                        </button>
                    </div>
                </div>
            </div>
        </PopupBackground>
    )
}

export default DeletionPopup