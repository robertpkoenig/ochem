import Link from 'next/link';
import * as React from 'react';
import ReactionListing from '../../model/ReactionListing';
import { primaryButtonMd, secondaryButtonMd } from '../../styles/common-styles';

export interface IReactionCardProps {
    reactionListing: ReactionListing
}

export default function ReactionCard (props: IReactionCardProps) {
  return (
    <div className="flex flex-row justify-between ">

    <div className="flex flex-col justify-center">
        {props.reactionListing.name}
    </div>

    <div className="flex flex-row gap-2">
        <Link href={"viewer/modules/" + props.reactionListing.reactionId}>
            <a className={ secondaryButtonMd }>Preview</a>
        </Link>

        <Link href={"editor/modules/" + props.reactionListing.reactionId}>
            <a className={ primaryButtonMd }>Edit</a>
        </Link>
        
    </div>
</div>
  );
}
