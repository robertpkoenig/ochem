import { PlusIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';
import * as React from 'react';
import Module from '../../model/Module';
import ReactionListing from '../../model/ReactionListing';
import Section from '../../model/SectionListing';
import { emptyState, roundEditButtonContainer, secondaryButtonSm } from '../../styles/common-styles';
import PopupBackground from '../PopupBackground';
import StudentReactionCard from './StudentReactionCard';
import { v4 as uuid } from 'uuid'
import Reaction from '../../p5/model/Reaction';
import ReactionStep from '../../p5/model/ReactionStep';

interface ISectionCardProps {
    section: Section
    module: Module
    completedReactionIds: Set<string>
    checkAdditionFunction: (reactionId: string) => void
}

interface ISectionCardState {}

export function SectionCard(props: ISectionCardProps){

    const filteredReactionList =
        Object.values(props.section.reactionListings).filter(reactionListing => {
            return reactionListing.visible
        })

    const reactionList = 
            <div className=" border border-gray-300 overflow-hidden rounded-md ">
                <ul className="divide-y divide-gray-300">
                    {filteredReactionList.map((reactionListing: ReactionListing) => 
                    <li key={reactionListing.uuid} className="px-6 py-4">
                        <StudentReactionCard
                            reactionListing={reactionListing}
                            section={props.section}
                            module={props.module}
                            modulesChecked={props.completedReactionIds}
                            checkAdditionFunction={props.checkAdditionFunction}
                        />
                    </li>
                    )}
                </ul>
            </div>
    
    
    return (
        <div className=" px-6 py-4 flex flex-col gap-4 bg-gray-100 overflow-hidden rounded-md">

                <div className="flex flex-row justify-between items-center">
                    <div className="font-semibold text-md bg-gray-100">
                        {props.section.name}
                    </div>
                </div>

                <div>
                    {reactionList}
                </div>

        </div>
    )

}

export default SectionCard
