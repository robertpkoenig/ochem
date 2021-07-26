import React from "react";
import Section from "../../../model/SectionListing";
import Module from "../../../model/Module";
import SectionCard from "../../../components/editor/SectionCard";
import Layout from "../../../components/Layout";
import { PlusIcon } from "@heroicons/react/solid";
import PopupBackground from "../../../components/PopupBackground";
import SectionPopup from "../../../components/editor/SectionPopup";
import { v4 as uuid } from 'uuid'
import { emptyState, primaryButtonMd } from "../../../styles/common-styles";
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async (context) => {

    if (!context.params.moduleId) {
        return {
        redirect: {
            destination: '/teacher/modules',
            permanent: false,
        },
        }
    }
    
    return {
        props: {
            moduleId: context.params.moduleId
        },
    }

}

interface IProps {
    moduleId: string
}

interface IState {
    sectionCreationPopupVis: boolean,
    module: Module
}

class ModulePage extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        
        super(props)

        const dummyModule: Module = {
            name: "dummy",
            creationDate: "dummy",
            authorId: "dummy",
            sections: [],
            uuid: "dummy"
        }

        this.state = {
            sectionCreationPopupVis: false,
            module: dummyModule
        }

        this.updateModule = this.updateModule.bind(this)

    }

    componentDidMount() {

        const moduleFromLocalStorageString: string | null = localStorage.getItem(this.props.moduleId)
        if (moduleFromLocalStorageString) {
            const module: Module = JSON.parse(moduleFromLocalStorageString)

            this.setState({
                ...this.state,
                module: module
            })
        }

    }

    updateModule(moduleCopy: Module) {
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

    toggleSectionCreationPopup() {
        this.setState((prevState: IState) => {
            return {
                ...prevState,
                sectionCreationPopupVis: !prevState.sectionCreationPopupVis
            }
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

        const sectionListEmptyState = <div className={emptyState}
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
                                module={this.state.module}
                                updateModule={this.updateModule}
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
                    onClick={() => this.toggleSectionCreationPopup()}
                >
                    <PlusIcon className="-ml-0.5 mr-2 h-5 w-5" aria-hidden="true" />
                    New section
                </button>

                {/* Toggle the section popup */}
                {
                this.state.sectionCreationPopupVis 
                ?
                <PopupBackground popupCloseFunction={this.toggleSectionCreationPopup.bind(this)}>
                    <SectionPopup
                        popupCloseFunction={this.toggleSectionCreationPopup.bind(this)} 
                        sectionAdditionFunction={this.createSection.bind(this)} 
                    />
                </PopupBackground>
                :
                ''
                }

            </Layout>

        )

    }

}

export default ModulePage