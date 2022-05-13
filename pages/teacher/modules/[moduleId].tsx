import React, { useContext, useEffect, useState } from "react";
import Section from "../../../persistence-model/SectionListing";
import Module from "../../../persistence-model/Module";
import SectionCard from "../../../components/editor/SectionCard";
import { PlusIcon } from "@heroicons/react/solid";
import SectionPopup from "../../../components/editor/SectionPopup";
import { v4 as uuid } from 'uuid'
import { doc, getDoc, updateDoc, getFirestore } from "firebase/firestore";
import { AuthContext } from "../../../context/authContext";
import ScreenWithLoading from "../../../components/common/ScreenWithLoading";
import ModuleEditorLayout from "../../../components/editor/ModuleEditorLayout";
import EmptyState from "../../../components/common/EmptyState";
import { useRouter } from "next/router";
import Button from "../../../components/common/buttons/Button";
import { MODULES, SECTIONS } from "../../../persistence-model/FirebaseConstants";

// This page allows lecturers to edit modules, which are collections 
// of reaction exercises organized around a university module.
// Teachers can:
// Create, delete, and reorder sections
// Create, delete, and reorder reactions
// Preview the module as students would see it
// Generate the invite link for students
// Access student engagement analytics
export default function ModulePage() {

    const [dummyBoolean, forceUpdate] = React.useState<boolean>(false);

    const [sectionCreationPopupVis, setSectionCreationPopupVis]
        = useState<boolean>(false)
    const [module, setModule] = useState<Module>(null)
    const [loading, setLoading] = useState<boolean>(true)

    const { user } = useContext(AuthContext)
    const router = useRouter()
    const db = getFirestore()

    // Load module data from Firestore
    async function getData() {
        const moduleId: string = router.query.moduleId as string
        const docRef = doc(db, MODULES, moduleId);
        const docSnap = await getDoc(docRef);
        setModule(docSnap.data() as Module)
        setLoading(false)
    }

    // This is triggered when the page is loaded and the user
    // context is not empty
    useEffect(() => {
        if (user) {
            getData()
        }
    }, [user])

    function toggleSectionCreationPopup() {
        setSectionCreationPopupVis(!sectionCreationPopupVis)
    }

    function createSection(name: string) {

        // Set the display order of the new section
        const order = module.sections ? Object.keys(module.sections).length : 0
        const sectionId = uuid()
        const creationDate = Date.now().toString()

        // Create the abbreviated section listing object
        const newSection: Section = {
            name: name,
            order: order,
            creationDate: creationDate,
            authorId: user.userId,
            uuid: sectionId,
            reactionListings: {}
        }

        // Update module in working memory
        module.sections[sectionId] = newSection
        setModule(module)

        // Create the section record in the module's nested collection of sections
        const moduleRecordDocLocation =
            doc(db,
                MODULES,
                module.uuid,
            )

        const sectionRefWithinModule = SECTIONS + "." + sectionId

        const newSectionUpdateObject: any = {}
        newSectionUpdateObject[sectionRefWithinModule] = newSection
    
        updateDoc(moduleRecordDocLocation, newSectionUpdateObject)

    }

    // The code should be refactored to remove this function.
    // It is used by components within the page to update the 
    // UI after the module is updated. This was the best way
    // found to update the UI when changing nested objects
    // within the module. However, it is likely that a better,
    // more react-idiomatic solution exists.
    function resetModule(module: Module) {
        const moduleCopy: Module = Object.assign(module) 
        setModule(moduleCopy)
        forceUpdate(!dummyBoolean)
    }

    const sectionListEmptyState =   <EmptyState text="This module has no sections" />

    let sectionList: React.ReactNode

    // Create the list of sections
    if (module && module.sections) {
        const orderedSectionObjects = Object.values(module.sections).sort((a,b) => {
            return a.order - b.order
        })
        sectionList = (
            <div className="flex flex-col gap-5 ">
                {orderedSectionObjects.map((sectionListing: Section) => 
                    <div key={sectionListing.order}>
                        <SectionCard
                            userId={user.userId}
                            section={sectionListing}
                            module={module}
                            setModuleFunction={resetModule}
                        />
                    </div>
                )}
            </div>
        )
    }

    return (
        <ScreenWithLoading loading={loading} >
            <ModuleEditorLayout
                module={module}
            >

                {/* Show the list of sections or an empty state */}
                <div className="flex flex-col gap-2">
                    {
                    module && Object.keys(module.sections).length > 0
                    ?
                    sectionList
                    :
                    sectionListEmptyState
                    }
                </div>

                <Button
                    text={"New Section"}
                    icon={PlusIcon}
                    onClick={toggleSectionCreationPopup}
                    extraClasses={"mt-5"}
                    size={"small"}
                    importance={"primary"}
                />

                {/* Toggle the section popup */}
                {
                    sectionCreationPopupVis &&
                    <SectionPopup
                        popupCloseFunction={toggleSectionCreationPopup} 
                        sectionAdditionFunction={createSection} 
                    />
                }

            </ModuleEditorLayout>
        </ScreenWithLoading>
    )

}