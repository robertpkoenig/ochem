import ReactionListing from "../../firebase/ReactionListing"
import { redButtonMd } from "../../styles/common-styles"

interface IProps {
    reactionListing: ReactionListing
    deleteReactionFunction: () => void
    toggleDeleteReactionPopup: () => void
}

// I have both delete the reaction listing (filter it out)
// and delete the reaction itself from the database
function DeleteReactionPopup(props: IProps) {

    function deleteReactionAndClosePopup() {
        props.deleteReactionFunction()
        props.toggleDeleteReactionPopup()
    }

    return (
        <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Delete reaction</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>You are about to delete:</p>
            <p><b>{props.reactionListing.name}</b></p>
            <p>Once you delete it, it will be permenantly lost</p>
            </div>
            <div className="mt-5">
            <button
                onClick={() => deleteReactionAndClosePopup()}
                type="button"
                className={redButtonMd}
            >
                Delete reaction
            </button>
            </div>
        </div>
        </div>
    )
}

export default DeleteReactionPopup