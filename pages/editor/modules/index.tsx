
import BlueNavBar from '../../../components/BlueNavBar'
import Layout from '../../../components/Layout'
import { Plus } from 'react-feather'
import React from 'react'
import { PlusIcon } from '@heroicons/react/solid'
import ModulePopup from '../../../components/editor/ModulePopup'
import PopupBackground from '../../../components/PopupBackground'
import { v4 as uuid } from 'uuid'
import ModuleCard from '../../../components/editor/ModuleCard'
import ModuleListing from '../../../model/ModuleListing'
import Module from '../../../model/Module'

interface IProps {
}

interface IState {
    popupVisible: boolean
    moduleListings: ModuleListing[]
}

export default class Modules extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props)
        this.state = {
            popupVisible: false,
            moduleListings: []
        }
        this.createModule = this.createModule.bind(this)
    }

    // Get modules from local storage
    // Replace this with firebase soon
    componentDidMount() {
        const listingsFromLocalStorageString: string | null = localStorage.getItem('moduleListings')
        if (listingsFromLocalStorageString) {
            const moduleListings = JSON.parse(listingsFromLocalStorageString)
            console.log(moduleListings);
            
            this.setState({
                ...this.state,
                moduleListings: moduleListings
            })
        }
    }

    togglePopup() {
        // this.setState(
        //     {
        //         popupVisible: !this.state.popupVisible
        //     }
        // )
        this.setState((prevState, props) => {
            return {popupVisible: !prevState.popupVisible};
        })
    }

    createModule(name: string) {
        const moduleId = uuid()
        const creationDate = Date.now().toString()
        const newModule: Module = {
            name: name,
            creationDate: creationDate,
            authorId: "dummy",
            sections: [],
            uuid: moduleId
        }
        localStorage.setItem(
            moduleId,
            JSON.stringify(newModule)
        )
        this.createModuleListing(name, moduleId, creationDate)
    }

    createModuleListing(name: string, moduleId: string, creationDate: string) {
        const newModuleListing: ModuleListing = {
            name: name,
            creationDate: creationDate,
            authorId: "dummy",
            uuid: moduleId
        }
        const augmentedModuleListings = Object.assign(this.state.moduleListings)
        augmentedModuleListings.push(newModuleListing)
        this.setState({
            ...this.state,
            moduleListings: augmentedModuleListings
        })
        localStorage.setItem(
            "moduleListings",
            JSON.stringify(augmentedModuleListings)
        )
    }

    render() {

        const moduleListEmptyState = <div className="h-24 border border-dashed border-gray-200
                                              rounded-lg text-gray-400 font-light flex
                                              flex-col place-content-center items-center "
                                      >
                                      You don't have any modules yet
                                      </div>
        console.log("listing in render function", this.state.moduleListings);
        
        const moduleList: any = (
        
            <div className="bg-white border border-gray-300 overflow-hidden rounded-md">
                <ul className="divide-y divide-gray-300">
                    {this.state.moduleListings.map((moduleListing: ModuleListing) => 
                        <li key={moduleListing.uuid} className="px-6 py-4">
                            <ModuleCard moduleListing={moduleListing} />
                        </li>
                    )}
                </ul>
            </div>

        )

        return (

            <Layout
                title="Modules"
                subtitle="Create collections for modules you teach"
            >
                    <div className="flex flex-col gap-2">
                    {
                    this.state.moduleListings.length > 0
                    ?
                    moduleList
                    :
                    moduleListEmptyState
                    }
                </div>

                <button
                    type="button"
                    className="mt-6 inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    onClick={this.togglePopup.bind(this)}
                >
                    <PlusIcon className="-ml-0.5 mr-2 h-5 w-5" aria-hidden="true" />
                    New Module
                </button>

                {this.state.popupVisible 
                    ?
                    <PopupBackground popupCloseFunction={this.togglePopup.bind(this)}>
                        <ModulePopup
                            popupCloseFunction={this.togglePopup.bind(this)} 
                            moduleAdditionFunction={this.createModule} 
                        />
                    </PopupBackground>
                    :
                    ''
                }

            </Layout>

        )

    }

}
