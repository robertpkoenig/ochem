import React from "react";
import Section from "../../../model/SectionListing";
import { withRouter, NextRouter } from 'next/router'
import Module from "../../../model/Module";
import SectionCard from "../../../components/editor/SectionCard";
import Layout from "../../../components/Layout";
import { PlusIcon } from "@heroicons/react/solid";
import PopupBackground from "../../../components/PopupBackground";
import SectionPopup from "../../../components/editor/SectionPopup";
import { stringify, v4 as uuid } from 'uuid'
import { primaryButtonMd } from "../../../styles/common-styles";
import ReactionPopup from "../../../components/editor/ReactionPopup";
import ReactionListing from "../../../model/ReactionListing";
import DeleteSectionPopup from "../../../components/editor/DeleteSectionPopup";

interface WithRouterProps {
    router: NextRouter
}

interface IProps extends WithRouterProps {

}

interface IState {
    uuid: string,
    sectionPopupVis: boolean,
    reactionPopupVis: boolean,
    deleteSectionPopupVis: boolean,
    selectedSection: Section | null,
    module: Module
}

class ModulePage extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props)

        const moduleId = this.props.router.query.moduleId

        const dummyModule: Module = {
            name: "dummy",
            creationDate: "dummy",
            authorId: "dummy",
            sections: [],
            uuid: "dummy"
        }

        this.state = {
            uuid: moduleId as string,
            sectionPopupVis: false,
            reactionPopupVis: false,
            deleteSectionPopupVis: false,
            selectedSection: null,
            module: dummyModule
        }

        this.toggleReactionPopup = this.toggleReactionPopup.bind(this)
        this.setSelectedReaction = this.setSelectedReaction.bind(this)
        this.createReaction = this.createReaction.bind(this)
        this.decrementSectionOrder = this.decrementSectionOrder.bind(this)
        this.incrementSectionOrder = this.incrementSectionOrder.bind(this)
        this.toggleDeleteSectionPopup = this.toggleDeleteSectionPopup.bind(this)
        this.deleteSection = this.deleteSection.bind(this)
    }

    componentDidMount() {

        if (!uuid) {
            this.props.router.push('/editor/modules')
            return
        }

        const moduleFromLocalStorageString: string | null = localStorage.getItem(this.state.uuid)
        if (moduleFromLocalStorageString) {
            const module: Module = JSON.parse(moduleFromLocalStorageString)

            this.setState({
                ...this.state,
                module: module
            })
        }

    }

    decrementSectionOrder(sectionId: string) {

        // Create copy of the module
        const moduleCopy: Module = Object.assign(this.state.module)

        let sectionToDecrementOrder: Section | null = null
        let sectionToIncrementOrder: Section | null = null

        for (const section of moduleCopy.sections) {
            if (sectionId === section.uuid) {
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

            // Reset the module in the working memory
            this.setState((prevState: IState) => {
                return {
                    ...prevState,
                    module: moduleCopy
                }
            })

            // Mirror this change in the local storage copy of the module
            localStorage.setItem(
                moduleCopy.uuid,
                JSON.stringify(moduleCopy)
            )

            this.sortSectionsByOrder()

        }

    }

    incrementSectionOrder(sectionId: string) {

        // Create copy of the module
        const moduleCopy: Module = Object.assign(this.state.module)

        let sectionToDecrementOrder: Section | null = null
        let sectionToIncrementOrder: Section | null = null

        for (const section of moduleCopy.sections) {
            if (sectionId === section.uuid) {
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

            // Reset the module in the working memory
            this.setState((prevState: IState) => {
                return {
                    ...prevState,
                    module: moduleCopy
                }
            })

            // Mirror this change in the local storage copy of the module
            localStorage.setItem(
                moduleCopy.uuid,
                JSON.stringify(moduleCopy)
            )

            this.sortSectionsByOrder()

        }

    }

    deleteSection(sectionId: string) {

        // Create copy of the module
        const moduleCopy: Module = Object.assign(this.state.module)

        // Get the section to delete
        let sectionToDelete: Section | null = null
        for (const section of moduleCopy.sections) {
            if (sectionId === section.uuid) {
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
            return section.uuid != sectionId
        })

        // Reset the module in the working memory
        this.setState((prevState: IState) => {
            return {
                ...prevState,
                module: moduleCopy
            }
        })

        // Mirror this change in the local storage copy of the module
        localStorage.setItem(
            moduleCopy.uuid,
            JSON.stringify(moduleCopy)
        )

    }

    toggleDeleteSectionPopup() {
        this.setState((prevState: IState) => {
            return {
                ...prevState,
                deleteSectionPopupVis: !prevState.deleteSectionPopupVis
            }
        })
    }

    sortSectionsByOrder() {
        // Create copy of the module
        const moduleCopy: Module = Object.assign(this.state.module)

        // Sort the moduleCopy's sections by order
        moduleCopy.sections.sort((a, b) => {
            return a.order - b.order
        })

        // Reset the module in the working memory
        this.setState((prevState: IState) => {
            return {
                ...this.state,
                module: moduleCopy
            }
        })

        // Mirror this change in the local storage copy of the module
        localStorage.setItem(
            moduleCopy.uuid,
            JSON.stringify(moduleCopy)
        )
    }

    toggleSectionPopup() {
        this.setState((prevState: IState) => {
            return {
                ...prevState,
                sectionPopupVis: !prevState.sectionPopupVis
            }
        })
    }

    toggleReactionPopup() {
        // Reset the module in the working memory
        this.setState((prevState: IState) => {
            return {
                ...prevState,
            reactionPopupVis: !prevState.reactionPopupVis
            }
        })
    }

    setSelectedReaction(sectionId: string) {

        let copyOfSelectedSession: Section | null = null

        for (const section of this.state.module.sections) {
            if (section.uuid == sectionId) {
                copyOfSelectedSession = Object.assign(section)
            }
        }

        console.log(copyOfSelectedSession);
        

        if (copyOfSelectedSession === null) {
            throw new Error("tried adding to section that does not exist")
        }
        
        // Reset the module in the working memory
        this.setState((prevState: IState) => {
            return {
                ...prevState,
                selectedSection: copyOfSelectedSession
            }
        })

    }

    createReaction(reactionName: string) {

        // At this point, there may be no selected section
        // Not sure how to avoid this eventuality
        if (this.state.selectedSection == null) {
            throw new Error("trying to create reaction, but no selected section")
        }

        const order = this.state.selectedSection.reactionListings.length
        const reactionId = uuid()
        const creationDate = Date.now().toString()

        // create the abbreviated reaction listing object
        const newReactionListing: ReactionListing = {
            name: reactionName,
            order: order,
            reactionId: reactionId,
            creationDate: creationDate,
            authorId: "dummy"
        }

        // Create copy of the module
        const moduleCopy: Module = Object.assign(this.state.module)

        for (const section of moduleCopy.sections) {
            if (section.uuid == this.state.selectedSection.uuid) {
                section.reactionListings.push(newReactionListing)
                break
            }
        }

        // Reset the module in the working memory
        this.setState((prevState: IState) => {
            return {
                ...prevState,
                module: moduleCopy
            }
        })

        // Mirror this change in the local storage copy of the module
        localStorage.setItem(
            moduleCopy.uuid,
            JSON.stringify(moduleCopy)
        )

    }

    setSelectedSectionToNull() {
        this.setState({
            ...this.state,
            selectedSection: null
        })
    }

    createSection(name: string) {

        // Set the display order of the new section
        const order = this.state.module.sections ? this.state.module.sections.length : 0
        const sectionId = uuid()
        const creationDate = Date.now().toString()

        // Create the abbreviated section listing object
        const newSectionListing: Section = {
            name: name,
            order: order,
            creationDate: creationDate,
            authorId: "dummy",
            uuid: sectionId,
            reactionListings: []
        }

        // Create copy of the module with the new section
        const moduleCopy: Module = Object.assign(this.state.module)
        moduleCopy.sections.push(newSectionListing)

        // Reset the module in the working memory
        this.setState((prevState: IState) => {
            return {
                ...prevState,
                module: moduleCopy
            }
        })

        // Mirror this change in the local storage copy of the module
        localStorage.setItem(
            moduleCopy.uuid,
            JSON.stringify(moduleCopy)
        )

    }

    render() {

        const sectionListEmptyState = <div className="h-24 border border-dashed border-gray-200
                                              rounded-lg text-gray-400 font-light flex
                                              flex-col place-content-center items-center "
                                      >
                                      This module has no sections
                                      </div>

        let sectionList: React.ReactNode

        if (this.state.module.sections) {
            sectionList = (
                <div className="flex flex-col gap-5 ">
                    {this.state.module.sections.map((sectionListing: Section) => 
                        <div key={sectionListing.order}>
                            <SectionCard
                                section={sectionListing}
                                toggleReactionCreationPopup={this.toggleReactionPopup}
                                setSelectedSection = {this.setSelectedReaction}
                                decrementSectionOrder = {this.decrementSectionOrder}
                                incrementSectionOrder = {this.incrementSectionOrder}
                                toggleSectionDeletionPopup = {this.toggleDeleteSectionPopup}
                            />
                        </div>
                    )}
                </div>
            )
        }

        return (

            <Layout
                title={this.state.module.name}
                subtitle="Subtitle or explenation for this module"
            >

                <div className="flex flex-col gap-2">
                    {
                    this.state.module.sections && this.state.module.sections.length > 0
                    ?
                    sectionList
                    :
                    sectionListEmptyState
                    }
                </div>

                <button
                    type="button"
                    className={primaryButtonMd + "mt-5"}
                    onClick={() => this.toggleSectionPopup()}
                >
                    <PlusIcon className="-ml-0.5 mr-2 h-5 w-5" aria-hidden="true" />
                    New Section
                </button>

                {/* Toggle the section popup */}
                {
                this.state.sectionPopupVis 
                ?
                <PopupBackground popupCloseFunction={this.toggleSectionPopup.bind(this)}>
                    <SectionPopup
                        popupCloseFunction={this.toggleSectionPopup.bind(this)} 
                        sectionAdditionFunction={this.createSection.bind(this)} 
                    />
                </PopupBackground>
                :
                ''
                }

                {/* Toggle the reaction popup */}
                {           
                this.state.reactionPopupVis 
                ?
                <PopupBackground popupCloseFunction={this.toggleReactionPopup}>
                    <ReactionPopup
                        popupCloseFunction={this.toggleReactionPopup} 
                        createReactionFunction={this.createReaction} 
                    />
                </PopupBackground>
                :
                ''
                }

                {/* Toggle the delete section popup */}
                {           
                this.state.deleteSectionPopupVis && this.state.selectedSection != null
                ?
                <PopupBackground popupCloseFunction={this.toggleDeleteSectionPopup}>
                    <DeleteSectionPopup
                        section={this.state.selectedSection}
                        deleteSectionFunction={this.deleteSection}
                        toggleDeleteSectionPopup = {this.toggleDeleteSectionPopup}
                    />
                </PopupBackground>
                :
                ''
                }

            </Layout>

        )

    }

}

export default withRouter(ModulePage)