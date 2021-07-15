import { PlusIcon } from '@heroicons/react/solid';
import * as React from 'react';
import { MouseEventHandler } from 'react';
import ReactionListing from '../../model/ReactionListing';
import Section from '../../model/SectionListing';
import { secondaryButtonSm } from '../../styles/common-styles';
import ReactionCard from './ReactionCard';


export interface ISectionCardProps {
    section: Section
    togglePopup: () => void
    setSelectedSection: (sectionId: string) => void
}

export default function SectionCard (props: ISectionCardProps) {

    const sectionListEmptyState =   <div className="h-24 border-2 border-dashed border-gray-300
                                        rounded-lg text-gray-400 font-light flex
                                        flex-col place-content-center items-center"
                                    >
                                    This section has no reactions yet
                                    </div>

    let sectionList: React.ReactNode

    if (props.section.reactionListings
        && props.section.reactionListings.length > 0) {
            sectionList = 
                <div className=" border border-gray-300 overflow-hidden rounded-md ">
                    <ul className="divide-y divide-gray-300">
                            {props.section.reactionListings.map((reactionListing: ReactionListing) => 
                                <li key={reactionListing.reactionId} className="px-6 py-4">
                                    <ReactionCard reactionListing={reactionListing} />
                                </li>
                            )}
                    </ul>
                </div>

    }

    function showReactionCreationPopup() {
        props.setSelectedSection(props.section.uuid)
        props.togglePopup()
    }

    return (
        <div className=" px-6 py-4 flex flex-col gap-4 bg-gray-100 overflow-hidden rounded-md">

                <div className="font-semibold text-md bg-gray-100">
                    {props.section.name}
                </div>

                <div>

                    {
                    sectionList
                    ?
                    sectionList
                    :
                    sectionListEmptyState
                    }

                </div>

                <div>
                    <button
                        onClick={showReactionCreationPopup}
                        type="button"
                        className={ secondaryButtonSm }
                    >
                        <PlusIcon className="-ml-0.5 mr-2 h-5 w-5" aria-hidden="true" />
                        New reaction
                    </button>
                </div>

        </div>
    );
}

