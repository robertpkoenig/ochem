import Link from "next/link"
import React, { useState } from "react"
import ModuleListing from "../../model/ModuleListing"
import { primaryButtonMd, primaryButtonSm, redButtonMd, redButtonSm, secondaryButtonMd, secondaryButtonSm } from "../../styles/common-styles"
import PopupBackground from "../PopupBackground"
import DeletionPopup from "./DeletionPopup"

import { getFirestore, doc, deleteDoc } from "firebase/firestore";
import firebaseClient from "../../firebaseClient";

const cardStyling = `flex flex-row space-between`

interface IProps {
    moduleListing: ModuleListing
    moduleListings: ModuleListing[]
    updateModuleListings: (moduleListings: ModuleListing[]) => void
}

function ModuleCard(props: IProps) {

    const [deleteModulePopupVisible, setModulePopupVisible] = useState(false)

    function deleteModuleAndHidePopup() {
        deleteModule()
        toggleDeleteModulePopup()
    }

    function deleteModule() {

        const db = getFirestore()

        // Get copy of list of modules 
        let moduleListCopy: ModuleListing[] = Object.assign(props.moduleListings)

        // Filter out the module being deleted
        moduleListCopy = moduleListCopy.filter(module => {
            return module.uuid != props.moduleListing.uuid
        })

        // Update the state on the parent list of modules
        props.updateModuleListings(moduleListCopy)
        
        // Remove module listing from the "module_listings" collection
        deleteDoc(doc(db, "module_listings", props.moduleListing.uuid))

        // TODO Remove the module from the modules collection
        deleteDoc(doc(db, "modules", props.moduleListing.uuid))

        
    }

    function toggleDeleteModulePopup() {
        setModulePopupVisible(!deleteModulePopupVisible)
    }

    return (
        <>
            <div className="flex flex-row justify-between ">

                <div className="flex flex-col justify-center">
                    {props.moduleListing.name}
                </div>

                <div className="flex flex-row gap-2">

                    <button
                        onClick={toggleDeleteModulePopup}
                        className={redButtonSm} 
                    >
                        Delete
                    </button>

                    <Link href={"/student/modules/" + props.moduleListing.uuid}>
                        <a className={ secondaryButtonSm }>Preview</a>
                    </Link>

                    <Link href={"/teacher/modules/" + props.moduleListing.uuid}>
                        <a className={ primaryButtonSm }>Edit</a>
                    </Link>
                </div>

            </div>

            {
                deleteModulePopupVisible
                ?
                <PopupBackground
                    popupCloseFunction={toggleDeleteModulePopup} 
                >
                    <DeletionPopup 
                        thing={props.moduleListing} 
                        thingType="module"
                        deletionFunction={deleteModuleAndHidePopup}
                        togglePopupFunction={toggleDeleteModulePopup}
                    />
                </PopupBackground>
                :
                ''
            }
        </>
    )
}

export default ModuleCard