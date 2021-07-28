
import Layout from '../../../components/Layout'
import React, { useContext, useEffect, useState } from 'react'
import ModuleListing from '../../../model/ModuleListing'
import Link from 'next/link'
import { primaryButtonMd } from '../../../styles/common-styles'
import { AuthContext } from '../../../context/provider'
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore'
import FirebaseConstants from '../../../model/FirebaseConstants'
import ScreenWithLoading from '../../../components/ScreenWithLoading'

interface IProps {
}

export default function StudentModules(props: IProps) {

    const [loading, setLoading] = useState<boolean>(true)
    const [moduleListings, setModuleListings] = useState<ModuleListing[]>([])

    const { user } = useContext(AuthContext)
    const db = getFirestore()

    async function getData() {

        const q = query(
            collection(db, FirebaseConstants.MODULE_LISTINGS),
            where(FirebaseConstants.UUID, "in", user.moduleIds)
        )

        const querySnapshot = await getDocs(q)
        
        const fetchedModuleListings: ModuleListing[] = []

        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            fetchedModuleListings.push(doc.data() as ModuleListing)
        })

        setModuleListings(fetchedModuleListings)

        setLoading(false)

    }

    useEffect(() => {
        if (user) {
            getData()
        }
    }, [user])
        
    const moduleList: React.ReactNode = (
    
        <div className="bg-white border border-gray-300 overflow-hidden rounded-md">
            <ul className="divide-y divide-gray-300">
                {moduleListings.map((moduleListing: ModuleListing) => 
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
        <ScreenWithLoading loading={loading}>
            <Layout
                title="My modules"
                subtitle=""
            >
                {moduleList}
            </Layout>
        </ScreenWithLoading>
    )

}
