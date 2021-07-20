
import BlueNavBar from '../../../components/BlueNavBar'
import Layout from '../../../components/Layout'
import React from 'react'
import ModulePopup from '../../../components/editor/ModulePopup'
import PopupBackground from '../../../components/PopupBackground'
import { v4 as uuid } from 'uuid'
import ModuleCard from '../../../components/editor/ModuleCard'
import Module from '../../../model/Module'
import ModuleListing from '../../../model/ModuleListing'
import Link from 'next/link'
import { primaryButtonMd, primaryButtonSm } from '../../../styles/common-styles'

interface IProps {
}

interface IState {
    moduleListings: ModuleListing[]
}

export default class StudentModules extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props)
        this.state = {
            moduleListings: []
        }
    }

    // Get modules from local storage
    // Replace this with firebase soon
    componentDidMount() {
        const listingsFromLocalStorageString: string | null = localStorage.getItem('moduleListings')
        if (listingsFromLocalStorageString) {
            const moduleListings = JSON.parse(listingsFromLocalStorageString)
            
            this.setState({
                ...this.state,
                moduleListings: moduleListings
            })
        }
    }

    render() {
        
        const moduleList: React.ReactNode = (
        
            <div className="bg-white border border-gray-300 overflow-hidden rounded-md">
                <ul className="divide-y divide-gray-300">
                    {this.state.moduleListings.map((moduleListing: ModuleListing) => 
                        <li key={moduleListing.uuid} className="px-6 py-6">
                            <div className="flex flex-row justify-between ">

                                <div className="flex flex-col justify-center font-semibold">
                                    {moduleListing.name}
                                </div>

                                <div className="flex flex-row gap-2">
                                    <Link href={"/student/modules/" + moduleListing.uuid}>
                                        <a className={ primaryButtonMd }>View</a>
                                    </Link>
                                </div>

                            </div>
                        </li>
                    )}
                </ul>
            </div>

        )

        return (

            <Layout
                title="My modules"
                subtitle=""
            >

                {moduleList}

            </Layout>

        )

    }

}
