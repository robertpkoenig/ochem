import React, { useContext, useEffect, useState } from "react";
import Section from "../../../model/SectionListing";
import { useRouter } from 'next/router'
import Module from "../../../model/Module";
import Layout from "../../../components/Layout";
import StudentSectionCard from "../../../components/student/StudentSectionCard";
import { AuthContext } from "../../../context/provider";
import { arrayUnion, collection, doc, getDoc, getFirestore, setDoc, updateDoc } from "firebase/firestore";
import FirebaseConstants from "../../../model/FirebaseConstants";
import ScreenWithLoading from "../../../components/ScreenWithLoading";
import EmptyState from "../../../components/EmptyState";

interface IProps {

}

export default function ModulePage(props: IProps) {

    const [module, setModule] = useState<Module>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [completedReactionIds, setCompletedReactionids] = useState<Set<string>>(null)

    const { user } = useContext(AuthContext)
    const db = getFirestore()
    const router = useRouter()

    async function getData() {
        const moduleId = router.query.moduleId as string

        const moduleDocRef = doc(db, FirebaseConstants.MODULES, moduleId);
        const docSnap = await getDoc(moduleDocRef);
        setModule(docSnap.data() as Module)
        setCompletedReactionids(new Set<string>(user.completedReactionIds))
        setLoading(false)
    }

    useEffect(() => {
        if (user) {
            getData()
            sendAnalyticsUpdate()
        }
    }, [user])

    function sendAnalyticsUpdate() {
        
        const moduleId = router.query.moduleId as string

        const date = new Date()
        date.setHours(0)
        date.setMinutes(0)
        date.setSeconds(0)
        date.setMilliseconds(0)
        const dateString = date.toISOString().substring(0, 10)

        const dateRecordDocLocation =
            doc(db,
                FirebaseConstants.MODULE_ANALYTICS_RECORDS,
                moduleId,
                FirebaseConstants.DATE_RECORDS,
                dateString
            )
        
        setDoc(dateRecordDocLocation, {
            "date": dateString,
            "studentIds": arrayUnion(user.userId)
        }, {merge: true})
        
    }

    function toggleReactionInCheckedReactions(reactionId: string) {

        const copyOfCheckedReactions = new Set<string>()

        completedReactionIds.forEach(value => {
            copyOfCheckedReactions.add(value)
        })

        if (completedReactionIds.has(reactionId)) {
            copyOfCheckedReactions.delete(reactionId)
        }
        else {
            copyOfCheckedReactions.add(reactionId)
        }
        
        setCompletedReactionids(copyOfCheckedReactions)

        const db = getFirestore()
        const docRef = doc(db, "users", user.userId);
        updateDoc(docRef, {
            completedReactionIds: [...copyOfCheckedReactions]
        })

    }

    const sectionListEmptyState = <EmptyState text="This module has no sections" />

    let sectionList: React.ReactNode = null

    if (module && module.sections && completedReactionIds) {
        const filteredSectionObjects = 
            Object.values(module.sections).filter(section => {
                const filteredReactionObjects = Object.values(section.reactionListings)
                    .filter(reaction => {
                        return reaction.visible
                    })
                return filteredReactionObjects.length > 0
            })
        sectionList = (
            <div className="flex flex-col gap-5 ">
                {filteredSectionObjects.map((sectionListing: Section) => 
                    <div key={sectionListing.order}>
                        <StudentSectionCard
                            section={sectionListing}
                            module={module}
                            completedReactionIds={completedReactionIds}
                            checkAdditionFunction={toggleReactionInCheckedReactions}
                        />
                    </div>
                )}
            </div>
        )
    }

    return (
        <ScreenWithLoading loading={loading} >
            <Layout
                title={module ? module.title : null}
                subtitle="Subtitle or explenation for this module"
            >
                {module && module.sections ? sectionList : sectionListEmptyState}
            </Layout>
        </ScreenWithLoading>
    )

}

