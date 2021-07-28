
import Layout from '../../../components/Layout'
import React, { ReactNode, useContext, useEffect, useState } from 'react'
import { PlusIcon } from '@heroicons/react/solid'
import ModulePopup from '../../../components/editor/ModulePopup'
import PopupBackground from '../../../components/PopupBackground'
import { v4 as uuid } from 'uuid'
import ModuleCard from '../../../components/editor/ModuleCard'
import ModuleListing from '../../../model/ModuleListing'
import Module from '../../../model/Module'
import { emptyState } from '../../../styles/common-styles'
import { collection, query, where, doc, getDocs, getFirestore, setDoc } from "firebase/firestore";
import { AuthContext } from '../../../context/provider'
import LoadingScreen from '../../../components/LoadingScreen'
import FirebaseConstants from '../../../model/FirebaseConstants'
import ScreenWithLoading from '../../../components/ScreenWithLoading'

interface IProps {
}

export default function Modules(props: IProps) {

    const [loading, setLoading] = useState<boolean>(true)
    const [createModulePopupVisible, setCreateModulePopupVisible] = useState<boolean>(false)
    const [deleteModulePopupVisible, setDeleteModulePopupVisible] = useState<boolean>(false)
    const [moduleListings, setModuleListings] = useState<ModuleListing[]>([])

    // Get modules from local storage
    // Replace this with firebase soon

    const { user } = useContext(AuthContext)
    const db = getFirestore()

    async function getData() {

        const q = query(
            collection(db, FirebaseConstants.MODULE_LISTINGS),
            where(FirebaseConstants.AUTHOR_ID, "==", user.userId)
        )
    
        const querySnapshot = await getDocs(q)
        
        const fetchedModuleListings: ModuleListing[] = []

        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data())
            fetchedModuleListings.push(doc.data() as ModuleListing)
        })

        setModuleListings(fetchedModuleListings)

        setLoading(false)

    }

    useEffect(() => {
        console.log("useEffect triggered");
        
        if (user) {
            getData()
        }
    }, [user])

    function toggleCreateModulePopup() {
        setCreateModulePopupVisible(!createModulePopupVisible)
    }

    function toggleDeleteModulePopup() {
        setDeleteModulePopupVisible(!deleteModulePopupVisible)
    }

    function createModule(name: string) {
        const moduleId = uuid()
        const creationDate = Date.now().toString()
        const newModule: Module = {
            name: name,
            creationDate: creationDate,
            authorId: user.userId,
            sections: [],
            uuid: moduleId
        }
        setDoc(doc(db, "modules", moduleId), newModule);
        createModuleListing(name, moduleId, creationDate)
    }

    function createModuleListing(name: string, moduleId: string, creationDate: string) {
        const newModuleListing: ModuleListing = {
            name: name,
            creationDate: creationDate,
            authorId: user.userId,
            uuid: moduleId
        }
        setDoc(doc(db, "module_listings", moduleId), newModuleListing);
        setModuleListings([newModuleListing, ...moduleListings])
    }

    const moduleListEmptyState = <div className={emptyState}
                                    >
                                    You don't have any modules yet
                                    </div>
                                    
    const moduleList: ReactNode = (
    
        <div className="bg-white border border-gray-300 overflow-hidden rounded-md">
            <ul className="divide-y divide-gray-300">
                {moduleListings.map((moduleListing: ModuleListing) => 
                    <li key={moduleListing.uuid} className="px-6 py-4">
                        <ModuleCard
                            moduleListing={moduleListing}
                            moduleListings={moduleListings}
                            updateModuleListings={setModuleListings}
                        />
                    </li>
                )}
            </ul>
        </div>

    )

    return (

        <ScreenWithLoading loading={loading} >
            <Layout
                title="Modules"
                subtitle="Create collections for modules you teach"
            >

                <div className="flex flex-col gap-2">
                    {
                    moduleListings.length > 0
                    ?
                    moduleList
                    :
                    moduleListEmptyState
                    }
                </div>

                <button
                    type="button"
                    className="mt-6 inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    onClick={toggleCreateModulePopup}
                >
                    <PlusIcon className="-ml-0.5 mr-2 h-5 w-5" aria-hidden="true" />
                    New module
                </button>

                {createModulePopupVisible 
                    ?
                    <PopupBackground popupCloseFunction={toggleCreateModulePopup}>
                        <ModulePopup
                            popupCloseFunction={toggleCreateModulePopup} 
                            moduleAdditionFunction={createModule} 
                        />
                    </PopupBackground>
                    :
                    ''
                }

            </Layout>
        </ScreenWithLoading>

    )

}
