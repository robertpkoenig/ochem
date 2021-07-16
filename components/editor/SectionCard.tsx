import { PlusIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';
import * as React from 'react';
import Module from '../../model/Module';
import ReactionListing from '../../model/ReactionListing';
import Section from '../../model/SectionListing';
import { secondaryButtonSm } from '../../styles/common-styles';
import PopupBackground from '../PopupBackground';
import DeleteSectionPopup from './DeleteSectionPopup';
import ReactionCard from './ReactionCard';
import ReactionCreationPopup from './ReactionPopup';
import { v4 as uuid } from 'uuid'

const roundEditButtonContainer =
    `
    flex
    flex-col
    items-center
    content-center
    justify-center
    bg-gray-200
    rounded-full
    w-6
    h-6
    `

interface ISectionCardProps {
    section: Section
    module: Module
    updateModule: (moduleCopy: Module) => void
}

interface ISectionCardState {
    sectionDeletePopupVisible: boolean
    reactionCreationPopupVisible: boolean
}

class SectionCard extends React.Component<ISectionCardProps, ISectionCardState> {

    constructor(props: ISectionCardProps) {
        super(props)
        this.state = {
            sectionDeletePopupVisible: false,
            reactionCreationPopupVisible: false
        }
        this.deleteThisSection = this.deleteThisSection.bind(this)
        this.toggleSectionDeletePopup = this.toggleSectionDeletePopup.bind(this)
        this.toggleReactionCreationPopup = this.toggleReactionCreationPopup.bind(this)
        this.createReaction = this.createReaction.bind(this)
    }

    decrementSectionOrder() {

        // Create copy of the module
        const moduleCopy: Module = Object.assign(this.props.module)

        let sectionToDecrementOrder: Section | null = null
        let sectionToIncrementOrder: Section | null =   null

        for (const section of moduleCopy.sections) {
            if (this.props.section.uuid === section.uuid) {
                sectionToDecrementOrder = section
            }
        }

        if (sectionToDecrementOrder == null) {
            throw new Error("tried to retrieve section that does not exist")
        }

        // Get the section above
        const orderAboveSectionToIncrementOrder = sectionToDecrementOrder.order - 1
        for (const section of moduleCopy.sections) {
            if (section.order === orderAboveSectionToIncrementOrder) {
                sectionToIncrementOrder = section
            }
        }

        // If the section above is not there, just ignore the rest of the logic
        if (sectionToIncrementOrder != null) {

            sectionToDecrementOrder.order--
            sectionToIncrementOrder.order++

            // Sort the moduleCopy's sections
            moduleCopy.sections.sort((a, b) => {
                return a.order - b.order
            })

            this.props.updateModule(moduleCopy)

        }

    }

    incrementSectionOrder() {
        // Create copy of the module
        const moduleCopy: Module = Object.assign(this.props.module)

        let sectionToDecrementOrder: Section | null = null
        let sectionToIncrementOrder: Section | null = null

        for (const section of moduleCopy.sections) {
            if (this.props.section.uuid === section.uuid) {
                sectionToIncrementOrder = section
            }
        }

        if (sectionToIncrementOrder == null) {
            throw new Error("tried to retrieve section that does not exist")
        }

        // Get the section above
        const orderAboveSectionToDecrementOrder = sectionToIncrementOrder.order + 1
        for (const section of moduleCopy.sections) {
            if (section.order === orderAboveSectionToDecrementOrder) {
                sectionToDecrementOrder = section
            }
        }

        // If the section above is not there, just ignore the rest of the logic
        if (sectionToDecrementOrder != null) {

            sectionToDecrementOrder.order--
            sectionToIncrementOrder.order++

            // Sort the moduleCopy's sections
            moduleCopy.sections.sort((a, b) => {
                return a.order - b.order
            })

            this.props.updateModule(moduleCopy)

        }
    }

    deleteThisSection() {
       
        // Create copy of the module
        const moduleCopy: Module = Object.assign(this.props.module)

        // Get the section to delete
        let sectionToDelete: Section | null = null
        for (const section of moduleCopy.sections) {
            if (this.props.section.uuid === section.uuid) {
                sectionToDelete = section
            }
        }

        // Throw error if section not found
        if (sectionToDelete === null) {
            throw new Error("tried to delete section that does not exist")
        }

        // Decrement the order of all sections above this section
        for (const section of moduleCopy.sections) {
            if (section.order > sectionToDelete.order) {
                section.order--
            }
        }

        // Filter out the section to delete
        moduleCopy.sections = moduleCopy.sections.filter(section => {
            return section.uuid != this.props.section.uuid
        })

        // Reset the model on the parent page
        this.props.updateModule(moduleCopy)
 
    }

    toggleSectionDeletePopup() {
        this.setState({
            ...this.state,
            sectionDeletePopupVisible: !this.state.sectionDeletePopupVisible
        })
    }

    toggleReactionCreationPopup() {
        this.setState({
            ...this.state,
            reactionCreationPopupVisible: !this.state.reactionCreationPopupVisible
        })
    }

    createReaction(reactionName: string) {
        const order = this.props.section.reactionListings.length
        const reactionId = uuid()
        const creationDate = Date.now().toString()

        // create the abbreviated reaction listing object
        const newReactionListing: ReactionListing = {
            name: reactionName,
            order: order,
            published: false,
            uuid: reactionId,
            creationDate: creationDate,
            authorId: "dummy"
        }

        // Create copy of the module
        const moduleCopy: Module = Object.assign(this.props.module)

        // Update this section within the module copy
        for (const section of moduleCopy.sections) {
            if (section.uuid == this.props.section.uuid) {
                section.reactionListings.push(newReactionListing)
                break
            }
        }

        // Update the module model on the parent element
        this.props.updateModule(moduleCopy)

    }

    render() {
        const sectionListEmptyState =   <div className="h-24 border-2 border-dashed border-gray-300
                                        rounded-lg text-gray-400 font-light flex
                                        flex-col place-content-center items-center"
                                        >
                                        This section has no reactions yet
                                        </div>

        let sectionList: React.ReactNode

        if (this.props.section.reactionListings
             && this.props.section.reactionListings.length > 0) {
                sectionList = 
                    <div className=" border border-gray-300 overflow-hidden rounded-md ">
                    <ul className="divide-y divide-gray-300">
                    {this.props.section.reactionListings.map((reactionListing: ReactionListing) => 
                    <li key={reactionListing.uuid} className="px-6 py-4">
                        <ReactionCard
                            reactionListing={reactionListing}
                            section={this.props.section}
                            module={this.props.module}
                            updateModule={this.props.updateModule}
                        />
                    </li>
                    )}
                    </ul>
                    </div>
        }
        
        return (
            <div className=" px-6 py-4 flex flex-col gap-4 bg-gray-100 overflow-hidden rounded-md">

                    <div className="flex flex-row justify-between items-center">
                        <div className="font-semibold text-md bg-gray-100">
                            {this.props.section.name}
                        </div>

                        <div className="flex flex-row content-center gap-1">
                            <button
                                className={roundEditButtonContainer}
                                onClick={() => this.incrementSectionOrder()}
                            >
                                <ChevronDownIcon className="stroke-2 w-5 h-5 text-gray-500 hover:text-gray-600" />
                            </button>
                            <button
                                className={roundEditButtonContainer}
                                onClick={() => this.decrementSectionOrder()}
                            >
                                <ChevronUpIcon className="stroke-2 w-5 h-5 text-gray-500 hover:text-gray-600" />
                            </button>
                            <button
                                className={roundEditButtonContainer + "text-gray-500"}
                                onClick={() => this.toggleSectionDeletePopup()}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

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
                            onClick={this.toggleReactionCreationPopup}
                            type="button"
                            className={ secondaryButtonSm }
                        >
                            <PlusIcon className="-ml-0.5 mr-2 h-5 w-5" aria-hidden="true" />
                            New reaction
                        </button>
                    </div>

                    {/* Toggle the delete section popup */}
                    {           
                    this.state.sectionDeletePopupVisible
                    ?
                    <PopupBackground popupCloseFunction={this.toggleSectionDeletePopup}>
                        <DeleteSectionPopup
                            section={this.props.section}
                            deleteSectionFunction={this.deleteThisSection}
                            toggleDeleteSectionPopup = {this.toggleSectionDeletePopup}
                        />
                    </PopupBackground>
                    :
                    ''
                    }

                    {/* Toggle the reaction popup */}
                    {           
                    this.state.reactionCreationPopupVisible 
                    ?
                    <PopupBackground popupCloseFunction={this.toggleReactionCreationPopup}>
                        <ReactionCreationPopup
                            popupCloseFunction={this.toggleReactionCreationPopup} 
                            createReactionFunction={this.createReaction} 
                        />
                    </PopupBackground>
                    :
                    ''
                    }

            </div>
        )
    }
}

export default SectionCard
