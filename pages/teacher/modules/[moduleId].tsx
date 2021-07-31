import React, { useContext, useEffect, useState } from "react";
import Section from "../../../model/SectionListing";
import Module from "../../../model/Module";
import SectionCard from "../../../components/editor/SectionCard";
import Layout from "../../../components/Layout";
import { PlusIcon } from "@heroicons/react/solid";
import { EyeIcon, PaperAirplaneIcon, PencilAltIcon } from "@heroicons/react/outline";
import PopupBackground from "../../../components/PopupBackground";
import SectionPopup from "../../../components/editor/SectionPopup";
import { v4 as uuid } from 'uuid'
import { emptyState, primaryButtonMd, secondaryButtonMd, secondaryButtonSm } from "../../../styles/common-styles";
import { GetServerSideProps } from 'next'
import { doc, getDoc, updateDoc, getFirestore } from "firebase/firestore";
import FirebaseConstants from "../../../model/FirebaseConstants";
import { AuthContext } from "../../../context/provider";
import LoadingScreen from "../../../components/LoadingScreen";
import ScreenWithLoading from "../../../components/ScreenWithLoading";
import SharePopup from "../../../components/editor/SharePopup";

export const getServerSideProps: GetServerSideProps = async (context) => {

    if (!context.params.moduleId) {
        return {
            redirect: {
                destination: '/teacher/modules',
                permanent: false,
            },
        }
    }
    
    return {
        props: {
            moduleId: context.params.moduleId
        },
    }

}

interface IProps {
    moduleId: string
}

export default function ModulePage(props: IProps) {

    const [dummyBoolean, forceUpdate] = React.useState<boolean>(false);

    const [sectionCreationPopupVis, setSectionCreationPopupVis]
        = useState<boolean>(false)
    const [sharePopupVis, setSharePopupVis]
        = useState<boolean>(false)
    const [module, setModule] = useState<Module>(null)
    const [loading, setLoading] = useState<boolean>(true)

    const { user } = useContext(AuthContext)
    const db = getFirestore()

    async function getData() {
        const docRef = doc(db, FirebaseConstants.MODULES, props.moduleId);
        const docSnap = await getDoc(docRef);
        setModule(docSnap.data() as Module)
        setLoading(false)
    }

    useEffect(() => {
        if (user) {
            getData()
        }
    }, [user])

    function toggleSectionCreationPopup() {
        setSectionCreationPopupVis(!sectionCreationPopupVis)
    }

    function toggleSharePopup() {
        setSharePopupVis(!sharePopupVis)
    }

    function createSection(name: string) {

        // Set the display order of the new section
        const order = module.sections ? module.sections.length : 0
        const sectionId = uuid()
        const creationDate = Date.now().toString()

        // Create the abbreviated section listing object
        const newSectionListing: Section = {
            name: name,
            order: order,
            creationDate: creationDate,
            authorId: user.userId,
            uuid: sectionId,
            reactionListings: []
        }

        // Update module in working memory
        module.sections.push(newSectionListing)
        setModule(module)

        // update module in firebase
        const moduleDocRef = doc(db, "modules", props.moduleId);
        updateDoc(moduleDocRef, {
            sections: module.sections
        });

    }

    function resetModule(module: Module) {
        const moduleCopy: Module = Object.assign(module) 
        setModule(moduleCopy)
        forceUpdate(!dummyBoolean)
    }

    const sectionListEmptyState =   <div className={emptyState}>
                                        This module has no sections
                                    </div>

    let sectionList: React.ReactNode

    if (module && module.sections) {
        sectionList = (
            <div className="flex flex-col gap-5 ">
                {module.sections.map((sectionListing: Section) => 
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

    const buttons = (
        <div className="bg-white rounded-lg shadow px-4 py-3 flex flex-row gap-2">
            <button
            type="button"
            className={secondaryButtonSm}
            onClick={() => toggleSectionCreationPopup()}
            >
                <PencilAltIcon className="-ml-0.5 mr-2 h-5 w-5" aria-hidden="true" />
                Rename
            </button>
            <button
            type="button"
            className={secondaryButtonSm}
            onClick={() => toggleSectionCreationPopup()}
            >
                <EyeIcon className="-ml-0.5 mr-2 h-5 w-5" aria-hidden="true" />
                Preview
            </button>
            <button
            type="button"
            className={secondaryButtonSm}
            onClick={() => toggleSharePopup()}
            >
                <PaperAirplaneIcon className="-ml-0.5 mr-2 h-5 w-5" aria-hidden="true" />
                Share
            </button>
        </div>
    )

    return (
        <ScreenWithLoading loading={loading} >
            <Layout
                title={module ? module.name : null}
                headerElement={ buttons }
                subtitle="Subtitle or explenation for this module"
            >

                <div className="flex flex-col gap-2">
                    {
                    module && module.sections.length > 0
                    ?
                    sectionList
                    :
                    sectionListEmptyState
                    }
                </div>

                <button
                    type="button"
                    className={primaryButtonMd + "mt-5"}
                    onClick={() => toggleSectionCreationPopup()}
                >
                    <PlusIcon className="-ml-0.5 mr-2 h-5 w-5" aria-hidden="true" />
                    New section
                </button>

                {/* Toggle the section popup */}
                {
                sectionCreationPopupVis 
                ?
                <PopupBackground popupCloseFunction={toggleSectionCreationPopup}>
                    <SectionPopup
                        popupCloseFunction={toggleSectionCreationPopup} 
                        sectionAdditionFunction={createSection} 
                    />
                </PopupBackground>
                :
                ''
                }

                {/* Toggle the share popup */}
                {
                sharePopupVis
                ?
                <SharePopup
                    popupCloseFunction={toggleSharePopup}
                    moduleId={module.uuid}
                />
                :
                null
                }

            </Layout>
        </ScreenWithLoading>

    )

}