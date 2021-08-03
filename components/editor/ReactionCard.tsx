import Link from 'next/link';
import * as React from 'react';
import { useState } from 'react';
import Module from '../../model/Module';
import ReactionListing from '../../model/ReactionListing';
import Section from '../../model/SectionListing';
import { primaryButtonSm, roundEditButtonContainer, secondaryButtonSm } from '../../styles/common-styles';
import PopupBackground from '../PopupBackground';
import DeletionPopup from './DeletionPopup';
import DeleteReactionPopup from './DeleteReactionPopup';
import { deleteDoc, doc, getFirestore, updateDoc } from 'firebase/firestore';
import FirebaseConstants from '../../model/FirebaseConstants';
import { PencilAltIcon } from '@heroicons/react/outline';

export interface IReactionCardProps {
    reactionListing: ReactionListing
    section: Section
    module: Module
    updateModule: (moduleCopy: Module) => void
}

export default function ReactionCard (props: IReactionCardProps) {

    const [deleteReactionPopupVisible, setReactionDeletionVisibility] =
        useState(false)
    const [reactionListing, setReactionListing] = useState(props.reactionListing)
        
    const db = getFirestore()

    function updateSectionsInFirebase() {
        // update module in firebase
        const moduleDocRef = doc(db, "modules", props.module.uuid);
        updateDoc(moduleDocRef, {
            sections: props.module.sections
        });
    }

    function decrementReactionOrder() {

        // Create copy of the module
        const moduleCopy: Module = Object.assign(props.module)

        let reactionToDecrementOrder = props.reactionListing
        let reactionToIncrementOrder: ReactionListing | null = null

        // Get the reaction copy within the section
        const orderOfReactionToIncrement = reactionToDecrementOrder.order - 1
        for (const reaction of Object.values(props.section.reactionListings)) {
            if (reaction.order === orderOfReactionToIncrement) {
                reactionToIncrementOrder = reaction
            }
        }

        if (reactionToIncrementOrder != null) {

            reactionToDecrementOrder.order--
            reactionToIncrementOrder.order++

            props.updateModule(moduleCopy)
            updateSectionsInFirebase()

        }
        
    }

    function incrementReactionOrder() {

        // Create copy of the module
        const moduleCopy: Module = Object.assign(props.module)

        let reactionToIncrementOrder = props.reactionListing
        let reactionToDecrementOrder: ReactionListing | null = null

        // Get the reaction copy within the section
        const orderOfReactionToDecrement = reactionToIncrementOrder.order + 1
        for (const reaction of Object.values(props.section.reactionListings)) {
            if (reaction.order === orderOfReactionToDecrement) {
                reactionToDecrementOrder = reaction
            }
        }

        if (reactionToDecrementOrder != null) {

            reactionToDecrementOrder.order--
            reactionToIncrementOrder.order++

            props.updateModule(moduleCopy)
            updateSectionsInFirebase()

        }
        
    }

    function toggleReactionDeletionPopup() {
        setReactionDeletionVisibility(!deleteReactionPopupVisible)
    }

    function deleteReaction() {

        // Create copy of the module
        const moduleCopy: Module = Object.assign(props.module)

        // delete the current reaction from the section
        delete moduleCopy.sections[props.section.uuid].reactionListings[props.reactionListing.uuid]
        
        // Decrement the order of each reaction after this one
        for (const reaction of Object.values(props.section.reactionListings)) {
            if (reaction.order > props.reactionListing.order) {
                reaction.order--
            }
        }

        // Replace the upstream module state with the module
        // without this reaction in this section
        props.updateModule(moduleCopy)

        // Delete ReactionListing in firebase
        const moduleDocRef = doc(db, "modules", props.module.uuid);

        const sectionUpdateObject: any = {}
        const reactionListingsRefString = FirebaseConstants.SECTIONS + "." + props.section.uuid +
        "." + FirebaseConstants.REACTION_LISTINGS
        sectionUpdateObject[reactionListingsRefString] = props.section.reactionListings

        updateDoc(moduleDocRef, sectionUpdateObject);

        // Delete core Reaction document in firebase
        const coreReactionRef = doc(db, FirebaseConstants.REACTIONS, props.reactionListing.uuid)
        deleteDoc(coreReactionRef)

    }

    const publishedIndicator = 
        <div className="flex flex-row gap-1 items-center group">
            <div className="invisible text-xs font-light text-gray-500 group-hover:visible">
                visible to students
            </div>
            <div
                onClick={null}
                className="bg-green-500 rounded-full w-2 h-2"
            ></div>
        </div>

    const notPublishedIndicator = 
        <div className="flex flex-row gap-1 items-center group">
            <div className="invisible text-xs font-light text-gray-500 group-hover:visible">
                not visible to students
            </div>
            <div
                onClick={null}
                className="bg-yellow-500 rounded-full w-2 h-2"
            >
            </div>
        </div>

    return (
        <div className="flex flex-row justify-between ">

            <div className="flex flex-row gap-4 items-center justify-center text-sm">
                {props.reactionListing.name}
            </div>

            <div className="flex flex-row justify-center content-center items-center gap-4">

                <div>
                    {/* Indicator for whether reaction is visible */}
                    {
                        props.reactionListing.visible
                        ?
                        publishedIndicator
                        :
                        notPublishedIndicator
                    }  
                </div>

                <div className="flex flex-row content-center justify-center gap-1">  

                    {/* Up button */}
                    <button
                        onClick={incrementReactionOrder}
                        className={roundEditButtonContainer}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path strokeWidth={4} fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>

                    {/* Down button */}
                    <button
                        onClick={decrementReactionOrder}
                        className={roundEditButtonContainer}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path strokeWidth={4} fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                    </button>

                    <button
                        onClick={toggleReactionDeletionPopup}
                        className={roundEditButtonContainer}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    
                </div>

                <div className="flex flex-row gap-2">
                    <Link href={"/teacher/reactions/" + props.reactionListing.uuid}>
                        <a className={ "flex gap-2 " + primaryButtonSm }>
                            <PencilAltIcon className="w-3 h-3" />
                            Edit
                        </a>
                    </Link>
                </div>

            </div>

            {/* Put the delete popup here */}
            {
                deleteReactionPopupVisible
                ?
                <PopupBackground
                    popupCloseFunction={toggleReactionDeletionPopup} 
                >
                    <DeletionPopup 
                        thing={props.reactionListing} 
                        thingType="reaction"
                        deletionFunction={deleteReaction}
                        togglePopupFunction={toggleReactionDeletionPopup}
                    />
                </PopupBackground>
                :
                ''
            }

        </div>
    )
}
