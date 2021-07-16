import Section from "../../model/SectionListing"

interface IProps {
    section: Section
    deleteSectionFunction: (sectionId: string) => void
    toggleDeleteSectionPopup: () => void
}

function DeleteSectionPopup(props: IProps) {

    function deleteSectionAndClosePopup() {
        props.deleteSectionFunction(props.section.uuid)
        props.toggleDeleteSectionPopup()
    }

    return (
        <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Delete section</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>You are about to delete:</p>
            <p><b>{props.section.name}</b></p>
            <p>Once you delete it, it will be permenantly lost</p>
            </div>
            <div className="mt-5">
            <button
                onClick={() => deleteSectionAndClosePopup()}
                type="button"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 sm:text-sm"
            >
                Delete section
            </button>
            </div>
        </div>
        </div>
    )
}

export default DeleteSectionPopup