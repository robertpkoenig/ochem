import { PlusIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';
import * as React from 'react';
import Module from '../../model/Module';
import ReactionListing from '../../model/ReactionListing';
import Section from '../../model/SectionListing';
import { roundEditButtonContainer, secondaryButtonSm } from '../../styles/common-styles';
import PopupBackground from '../PopupBackground';
import ReactionCard from './ReactionCard';
import ReactionCreationPopup from './ReactionPopup';
import { v4 as uuid } from 'uuid'
import DeletionPopup from './DeletionPopup';
import Reaction from '../../p5/model/Reaction';
import ReactionStep from '../../p5/model/ReactionStep';
import { arrayUnion, doc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import { AuthContext } from '../../context/provider';
import FirebaseConstants from '../../model/FirebaseConstants';
import { PencilIcon } from '@heroicons/react/outline';
import SectionRenamePopup from './SectionRenamePopup';
import EmptyState from '../EmptyState';

interface IProps {
    userId: string
    section: Section
    module: Module
    setModuleFunction: (moduleCopy: Module) => void
}

export default function SectionCard(props: IProps) {

    const [sectionDeletePopupVis, setSectionDeletePopupVis]
        = React.useState<boolean>(false)
    const [sectionRenamePopupVis, setSectionRenamePopupVis]
        = React.useState<boolean>(false)
    const [reactionCreationPopupVis, setReactionCreationPopupVis]
        = React.useState<boolean>(false)

    const db = getFirestore()

    function decrementSectionOrder() {

        let sectionToDecrementOrder: Section = props.section
        let sectionToIncrementOrder: Section | null =   null

        // Get the section above
        const orderAboveSectionToIncrementOrder = sectionToDecrementOrder.order - 1
        for (const section of Object.values(props.module.sections)) {
            if (section.order === orderAboveSectionToIncrementOrder) {
                sectionToIncrementOrder = section
            }
        }

        // If the section above is not there, just ignore the rest of the logic
        if (sectionToIncrementOrder != null) {

            sectionToDecrementOrder.order--
            sectionToIncrementOrder.order++

            props.setModuleFunction(props.module)
            updateSectionsInFirebase()

        }

    }

    function incrementSectionOrder() {

        let sectionToDecrementOrder: Section | null = null
        let sectionToIncrementOrder: Section = props.section

        // Get the section above
        const orderAboveSectionToDecrementOrder = sectionToIncrementOrder.order + 1
        for (const section of Object.values(props.module.sections)) {
            if (section.order === orderAboveSectionToDecrementOrder) {
                sectionToDecrementOrder = section
            }
        }

        // If the section above is not there, just ignore the rest of the logic
        if (sectionToDecrementOrder != null) {

            sectionToDecrementOrder.order--
            sectionToIncrementOrder.order++

            props.setModuleFunction(props.module)
            updateSectionsInFirebase()

        }
    }

    function deleteThisSection() {

        // Get the section to delete
        let sectionToDelete: Section  = props.section

        // Decrement the order of all sections above this section
        for (const section of Object.values(props.module.sections)) {
            if (section.order > sectionToDelete.order) {
                section.order--
            }
        }

        // Filter out the section to delete
        delete props.module.sections[props.section.uuid]
        // props.module.sections = props.module.sections.filter(section => {
        //     return section.uuid != props.section.uuid
        // })

        // Reset the model on the parent page
        props.setModuleFunction(props.module)
        updateSectionsInFirebase()
 
    }

    function updateSectionsInFirebase() {
        // update module in firebase
        const moduleDocRef = doc(db, "modules", props.module.uuid);
        updateDoc(moduleDocRef, {
            sections: props.module.sections
        });
    }

    function toggleSectionDeletePopup() {
        setSectionDeletePopupVis(!sectionDeletePopupVis)
    }
    
    function toggleSectionRenamePopup() {
        setSectionRenamePopupVis(!sectionRenamePopupVis)
    }

    function toggleReactionCreationPopup() {
        setReactionCreationPopupVis(!reactionCreationPopupVis)
    }

    function renameSection(newName: string) {
        props.section.name = newName
        props.setModuleFunction(props.module)
        updateSectionsInFirebase()
    }

    function createReaction(reactionName: string) {
        const order = Object.keys(props.section.reactionListings).length
        const reactionId = uuid()
        const creationDate = Date.now().toString()

        // Create the abbreviated reaction listing object
        const newReactionListing: ReactionListing = {
            name: reactionName,
            order: order,
            visible: false,
            uuid: reactionId,
            creationDate: creationDate,
            authorId: props.userId
        }

        props.section.reactionListings[reactionId] = newReactionListing

        // Update the module model on the parent element
        props.setModuleFunction(props.module)

        const reactionRefWithinSection =
            FirebaseConstants.SECTIONS + "."+ props.section.uuid + "."+
            FirebaseConstants.REACTION_LISTINGS + "." + reactionId

        const newSectionUpdateObject: any = {}
        newSectionUpdateObject[reactionRefWithinSection] = newReactionListing

        // Create the new nested reaction listing document
        // in the module's section document's reaction listings collection
        const sectionRecordDocLocation =
            doc(db, FirebaseConstants.MODULES, props.module.uuid)
        updateDoc(sectionRecordDocLocation, newSectionUpdateObject)

        // Create a new full reaction object
        const newReaction = new Reaction(
            reactionName,
            reactionId,
            props.module.uuid,
            props.module.title,
            props.section.uuid,
            props.section.name,
            props.userId,
            false,
            [],
            null,
            ''
        )

        // Add the first reaction step
        const firstReactionStep = new ReactionStep(0)
        newReaction.steps.push(firstReactionStep)
        newReaction.currentStep = firstReactionStep

        // Set the full reaction document in the firebase reactions collection
        setDoc(doc(db, "reactions", reactionId), newReaction.toJSON());

    }

    const reactionListEmptyState =  <EmptyState text="This section has no reactions yet" />

    let reactionList: React.ReactNode

    if (props.section.reactionListings
            && Object.keys(props.section.reactionListings).length > 0) {
            const sortedReactionObjects = Object.values(props.section.reactionListings)
            sortedReactionObjects.sort((a, b) => {
                return a.order - b.order
            })
            reactionList = 
                <div className=" border border-gray-300 overflow-hidden rounded-md ">
                    <ul className="divide-y divide-gray-300">
                        {sortedReactionObjects.map((reactionListing: ReactionListing) => 
                            <li key={reactionListing.uuid} className="px-6 py-4">
                                <ReactionCard
                                    reactionListing={reactionListing}
                                    section={props.section}
                                    module={props.module}
                                    updateModule={props.setModuleFunction}
                                />
                            </li>
                        )}
                    </ul>
                </div>
    }
        
        return (
            <div className=" px-6 py-4 flex flex-col gap-4 bg-gray-100 overflow-hidden rounded-md">

                    <div className="flex flex-row justify-between items-center">
                        <div className="flex gap-2 items-center group">
                            <div className="font-semibold text-md bg-gray-100">
                                {props.section.name}
                            </div>
                            <div>
                                <PencilIcon
                                    onClick={toggleSectionRenamePopup}
                                    className="invisible w-4 h-4 text-gray-400 hover:text-gray-500 cursor-pointer group-hover:visible"
                                />
                            </div>
                        </div>

                        <div className="flex flex-row content-center gap-1">
                            <button
                                className={roundEditButtonContainer}
                                onClick={incrementSectionOrder}
                            >
                                <ChevronDownIcon className="stroke-2 w-4 h-4 hover:text-gray-600" />
                            </button>
                            <button
                                className={roundEditButtonContainer}
                                onClick={decrementSectionOrder}
                            >
                                <ChevronUpIcon className="stroke-2 w-4 h-4 hover:text-gray-600" />
                            </button>
                            <button
                                className={roundEditButtonContainer}
                                onClick={toggleSectionDeletePopup}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                </div>

                    <div>

                        {
                        reactionList
                        ?
                        reactionList
                        :
                        reactionListEmptyState
                        }

                    </div>

                    <div>
                        <button
                            onClick={toggleReactionCreationPopup}
                            type="button"
                            className={ secondaryButtonSm }
                        >
                            <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                            New reaction
                        </button>
                    </div>

                    {/* Toggle the delete section popup */}
                    {           
                    sectionDeletePopupVis
                    ?
                    <DeletionPopup
                        thing={props.section}
                        thingType="section"
                        deletionFunction={deleteThisSection}
                        togglePopupFunction = {toggleSectionDeletePopup}
                    />
                    :
                    ''
                    }

                    {/* Toggle the reaction popup */}
                    {           
                    reactionCreationPopupVis 
                    ?
                    <ReactionCreationPopup
                        popupCloseFunction={toggleReactionCreationPopup} 
                        createReactionFunction={createReaction} 
                    />
                    :
                    ''
                    }

                    {/* Section rename */}
                    {
                        sectionRenamePopupVis
                        ?
                        <SectionRenamePopup 
                            section={props.section}
                            popupCloseFunction={toggleSectionRenamePopup}
                            sectionRenameFunction={renameSection}
                        />
                        :
                        null
                    }

            </div>
        )
}
