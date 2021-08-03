import Link from 'next/link';
import * as React from 'react';
import { useState } from 'react';
import Module from '../../model/Module';
import ReactionListing from '../../model/ReactionListing';
import Section from '../../model/SectionListing';
import { primaryButtonMd, primaryButtonSm, roundEditButtonContainer, secondaryButtonSm } from '../../styles/common-styles';
import PopupBackground from '../PopupBackground';

export interface IReactionCardProps {
    reactionListing: ReactionListing
    section: Section
    module: Module
    modulesChecked: Set<string>
    checkAdditionFunction: (reactionId: string) => void
}

export interface IReactionCardState {
    deleteReactionPopupVisible: boolean
}

export default function StudentReactionCard (props: IReactionCardProps) {

    // console.log(props.modulesChecked);

    const isChecked = props.modulesChecked.has(props.module.uuid)

    const link =<div className="flex flex-row gap-2">
                    <Link href={"/student/reactions/" + props.reactionListing.uuid}>
                        <button className={ primaryButtonMd }>Practice</button>
                    </Link>
                </div>
    

    return (
        <div className="flex flex-row items-center justify-between ">

            <div className="flex flex-row items-center gap-3">
                <div className="flex items-center h-5">
                    <input
                        id="comments"
                        aria-describedby="comments-description"
                        name="comments"
                        type="checkbox"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded cursor-pointer"
                        defaultChecked={isChecked}
                        onChange={() => props.checkAdditionFunction(props.module.uuid)}
                    />
                </div>
                <span>
                    {props.reactionListing.name}
                </span>
            </div>

            <div className="flex flex-row justify-center content-center items-center gap-4">
                {link}
            </div>

        </div>
    )

}
