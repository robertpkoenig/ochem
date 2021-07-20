import React from "react";
import Section from "../../../model/SectionListing";
import { withRouter, NextRouter } from 'next/router'
import Module from "../../../model/Module";
import Layout from "../../../components/Layout";
import { PlusIcon } from "@heroicons/react/solid";
import PopupBackground from "../../../components/PopupBackground";
import SectionPopup from "../../../components/editor/SectionPopup";
import { v4 as uuid } from 'uuid'
import { emptyState, primaryButtonMd } from "../../../styles/common-styles";
import StudentSectionCard from "../../../components/student/StudentSectionCard";

interface WithRouterProps {
    router: NextRouter
}

interface IProps extends WithRouterProps {

}

interface IState {
    uuid: string,
    sectionCreationPopupVis: boolean,
    module: Module
    modulesChecked: Set<string>
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
            sectionCreationPopupVis: false,
            module: dummyModule,
            modulesChecked: new Set()
        }

        this.toggleReactionInCheckedReactions = this.toggleReactionInCheckedReactions.bind(this)

    }

    componentDidMount() {

        if (!uuid) {
            this.props.router.push('/editor/modules')
            return
        }

        const moduleFromLocalStorageString: string | null = localStorage.getItem(this.state.uuid)

        if (!moduleFromLocalStorageString)
            throw new Error("module not found in localStorage")

        if (moduleFromLocalStorageString) {
            const module: Module = JSON.parse(moduleFromLocalStorageString)

            this.setState(prevState => {
                return {
                    ...prevState,
                    module: module
                }
            })
        }

        // get the records of what reactions have been checked
        const modulesCheckedRawArray = JSON.parse(localStorage.getItem("modulesChecked"))
        const modulesCheckedSet = new Set<string>()

        console.log("modulesCheckedRawArray from storage", modulesCheckedRawArray);

        if (modulesCheckedRawArray) {

            for (const item of modulesCheckedRawArray) {
                modulesCheckedSet.add(item)
            }

            this.setState(prevState => {
                return {
                    ...prevState,
                    modulesChecked: modulesCheckedSet
                }
            })

        }

    }

    toggleReactionInCheckedReactions(reactionId: string) {

        const copyOfCheckedModules = new Set<string>()

        this.state.modulesChecked.forEach(value => {
            copyOfCheckedModules.add(value)
        })

        if (this.state.modulesChecked.has(reactionId)) {
            copyOfCheckedModules.delete(reactionId)
        }
        else {
            copyOfCheckedModules.add(reactionId)
        }

        this.setState({
            ...this.state,
            modulesChecked: copyOfCheckedModules
        })

        localStorage.setItem("modulesChecked", JSON.stringify(Array.from(copyOfCheckedModules)))

        console.log(JSON.stringify(Array.from(copyOfCheckedModules)));
        

    }

    render() {

        const sectionList = (
            <div className="flex flex-col gap-5 ">
                {this.state.module.sections.map((sectionListing: Section) => 
                    <div key={sectionListing.order}>
                        <StudentSectionCard
                            section={sectionListing}
                            module={this.state.module}
                            modulesChecked={this.state.modulesChecked}
                            checkAdditionFunction={this.toggleReactionInCheckedReactions}
                        />
                    </div>
                )}
            </div>
        )

        return (

            <Layout
                title={this.state.module.name}
                subtitle="Subtitle or explenation for this module"
            >
                {sectionList}
            </Layout>

        )

    }

}

export default withRouter(ModulePage)