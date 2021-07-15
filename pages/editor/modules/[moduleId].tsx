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

interface WithRouterProps {
    router: NextRouter
}

interface IProps extends WithRouterProps {

}

interface IState {
    uuid: string,
    sectionPopupVis: boolean,
    reactionPopupVis: boolean,
    copyOfSelectedSession: Section | null,
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
            copyOfSelectedSession: null,
            module: dummyModule
        }

        this.toggleReactionPopup = this.toggleReactionPopup.bind(this)
        this.setSelectedReaction = this.setSelectedReaction.bind(this)
        this.createReaction = this.createReaction.bind(this)
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

    toggleSectionPopup() {
        this.setState({
            ...this.state,
            sectionPopupVis: !this.state.sectionPopupVis
        })
    }

    toggleReactionPopup() {
        // Reset the module in the working memory
        this.setState((prevState: IState) => {
            return {
                ...prevState,
            reactionPopupVis: !this.state.reactionPopupVis
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
                copyOfSelectedSession: copyOfSelectedSession
            }
        })

    }

    createReaction(reactionName: string) {

        // At this point, there may be no selected section
        // Not sure how to avoid this eventuality
        if (this.state.copyOfSelectedSession == null) {
            throw new Error("trying to create reaction, but no selected section")
        }

        const order = this.state.copyOfSelectedSession.reactionListings.length
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

        const copyOfSelectedSession = this.state.copyOfSelectedSession

        // add the new reaction listing to the selected section
        // create a copy of the module
        // filter out the selectedReaction
        
        copyOfSelectedSession.reactionListings.push(newReactionListing)

        // Create copy of the module
        const moduleCopy: Module = Object.assign(this.state.module)

        // Filter out the old version of the selected section
        moduleCopy.sections = moduleCopy.sections.filter(section => {
            return section.uuid != copyOfSelectedSession.uuid
        })

        // Add in the new version of the selected session
        moduleCopy.sections.push(copyOfSelectedSession)

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

    setSelectedSectionToNull() {
        this.setState({
            ...this.state,
            copyOfSelectedSession: null
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

        console.log("in render", this.state.copyOfSelectedSession);
        

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
                                togglePopup={this.toggleReactionPopup}
                                setSelectedSection = {this.setSelectedReaction}
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

            </Layout>

        )

    }

}

export default withRouter(ModulePage)