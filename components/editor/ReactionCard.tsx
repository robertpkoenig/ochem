import Link from 'next/link';
import * as React from 'react';
import { useState } from 'react';
import Module from '../../firebase/Module';
import ReactionListing from '../../firebase/ReactionListing';
import Section from '../../firebase/SectionListing';
import PopupBackground from '../PopupBackground';
import DeletionPopup from './DeletionPopup';
import { deleteDoc, doc, getFirestore, updateDoc } from 'firebase/firestore';
import { PencilAltIcon } from '@heroicons/react/outline';
import Button from '../common/buttons/Button';
import RoundButton from '../common/buttons/RoundButton';
import { ChevronDownIcon, ChevronUpIcon, XIcon } from '@heroicons/react/solid';
import { REACTIONS, REACTION_LISTINGS, SECTIONS } from '../../firebase/FirebaseConstants';

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
        const reactionListingsRefString = SECTIONS + "." + props.section.uuid +
        "." + REACTION_LISTINGS
        sectionUpdateObject[reactionListingsRefString] = props.section.reactionListings

        updateDoc(moduleDocRef, sectionUpdateObject);

        // Delete core Reaction document in firebase
        const coreReactionRef = doc(db, REACTIONS, props.reactionListing.uuid)
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
                    <RoundButton
                        icon={ChevronDownIcon}
                        onClick={incrementReactionOrder}                    
                    />

                    {/* Down button */}
                    <RoundButton
                        icon={ChevronUpIcon}
                        onClick={decrementReactionOrder}                    
                    />

                    {/* Delete button */}
                    <RoundButton
                        icon={XIcon}
                        onClick={toggleReactionDeletionPopup}                    
                    />
                    
                </div>

                <div className="flex flex-row gap-2">
                    <Link href={"/teacher/reactions/" + props.reactionListing.uuid}>
                        <a>
                            <Button
                                size={"small"}
                                importance={"primary"}
                                text={"Edit"}
                                icon={PencilAltIcon}
                                onClick={null}
                                extraClasses={""} />
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
