import Link from 'next/link';
import Module from '../../persistence-model/Module';
import ReactionListing from '../../persistence-model/ReactionListing';
import Section from '../../persistence-model/SectionListing';
import Button from '../common/buttons/Button';

export interface IReactionCardProps {
    reactionListing: ReactionListing
    section: Section
    module: Module
    reactionsChecked: Set<string>
    checkAdditionFunction: (reactionId: string) => void
}

// This is the card for an individual exercise in the student module page
export default function StudentReactionCard (props: IReactionCardProps) {

    const isChecked = props.reactionsChecked.has(props.reactionListing.uuid)

    const link =
        <div className="flex flex-row gap-2">
            <Link href={"/student/reactions/" + props.reactionListing.uuid}>
                <a>
                    <Button 
                        size={'small'} 
                        importance={'primary'} 
                        text={'Practice'} 
                        icon={null}
                        onClick={null}
                        extraClasses={''}
                    />
                </a>
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
                        onChange={() => props.checkAdditionFunction(props.reactionListing.uuid)}
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
