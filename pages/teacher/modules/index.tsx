
import Layout from '../../../components/Layout'
import React, { ReactNode, useContext, useEffect, useState } from 'react'
import { PlusIcon } from '@heroicons/react/solid'
import ModulePopup from '../../../components/editor/ModulePopup'
import PopupBackground from '../../../components/PopupBackground'
import { v4 as uuid } from 'uuid'
import ModuleCard from '../../../components/editor/ModuleCard'
import ModuleListing from '../../../firebase/ModuleListing'
import Module from '../../../firebase/Module'
import { collection, query, where, doc, getDocs, getFirestore, setDoc } from "firebase/firestore";
import { AuthContext } from '../../../context/provider'
import FirebaseConstants from '../../../firebase/FirebaseConstants'
import ScreenWithLoading from '../../../components/ScreenWithLoading'
import ModuleAnalyticsRecord from '../../../firebase/ModuleAnalyticsRecord'
import EmptyState from '../../../components/EmptyState'

// Shows a list of all the modules owned by the lecturer.
// Teachers can create and delete modules in this page.
export default function Modules() {

    const [loading, setLoading] = useState<boolean>(true)
    const [createModulePopupVisible, setCreateModulePopupVisible] = useState<boolean>(false)
    const [deleteModulePopupVisible, setDeleteModulePopupVisible] = useState<boolean>(false)
    const [moduleListings, setModuleListings] = useState<ModuleListing[]>([])

    // Get modules from local storage
    // Replace this with firebase soon

    const { user } = useContext(AuthContext)
    const db = getFirestore()

    // Loads all module listing documents created by this user
    // from Firebase
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

    // Called once when the page is loaded and the
    // user object is not empty (the user is logged in)
    useEffect(() => {
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

    // Creates the core module record in Firebase
    function createModule(name: string, subtitle: string) {
        const moduleId = uuid()
        const creationDate = Date.now().toString()

        // The core module document
        const newModule: Module = {
            title: name,
            subtitle: subtitle,
            creationDate: creationDate,
            authorId: user.userId,
            sections: {},
            uuid: moduleId
        }
        setDoc(doc(db, FirebaseConstants.MODULES, moduleId), newModule);
        createModuleListing(name, moduleId, creationDate)

        // The analytics record for this module
        const newModuleAnalyticsRecord: ModuleAnalyticsRecord = {
            moduleName: name,
            moduleId: moduleId,
            studentIds: []
        }

        setDoc(doc(db, FirebaseConstants.MODULE_ANALYTICS_RECORDS, moduleId), newModuleAnalyticsRecord)
    }

    // Creates the abridged module document
    function createModuleListing(name: string, moduleId: string, creationDate: string) {
        const newModuleListing: ModuleListing = {
            name: name,
            creationDate: creationDate,
            authorId: user.userId,
            authorName: user.firstName + " " + user.lastName,
            uuid: moduleId
        }
        setDoc(doc(db, FirebaseConstants.MODULE_LISTINGS, moduleId), newModuleListing);
        setModuleListings([newModuleListing, ...moduleListings])
    }

    const moduleListEmptyState = <EmptyState text="You don&apos;t have any modules yet" />
           
    // Create the list of module cards
    const moduleList: ReactNode = (
    
        <div className=" overflow-hidden rounded-md">
            <ul className="space-y-4">
                {moduleListings.map((moduleListing: ModuleListing) => 
                    <li key={moduleListing.uuid} className="px-6 py-4 bg-gray-100 rounded-md">
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
