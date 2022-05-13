import { CalendarIcon, UsersIcon } from "@heroicons/react/outline";
import React, { useContext, useEffect, useState } from "react";
import PageLayout from "../../../components/common/PageLayout";
import ScreenWithLoading from "../../../components/common/ScreenWithLoading";
import { Line } from 'react-chartjs-2';
import { collection, doc, getDoc, getDocs, getFirestore, limit, orderBy, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { AuthContext } from "../../../context/authContext";
import ModuleAnalyticsRecord from "../../../persistence-model/ModuleAnalyticsRecord";
import { DATE_RECORDS, MODULE_ANALYTICS_RECORDS } from "../../../persistence-model/FirebaseConstants";

interface DateRecord {
    date: string,
    studentIds: string[]
}

/*
     This page displays analytics on student engagement for a given module   
*/

export default function Analytics() {

    const [loading, setLoading] = useState<boolean>(true)
    const [moduleAnalyticsRecord, setModuleAnalyticsRecord] = useState<ModuleAnalyticsRecord>(null)
    const [numUniquesLastSevenDays, setNumUniquesLastSevenDays] = useState<number>(0)
    // This is the data object used by the graphing library.
    const [data, setData] = useState(null)

    const router = useRouter()
    const { user } = useContext(AuthContext)

    // This object defines the formatting parameters for the 
    const options = {
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                    },
                },
            ],
        },
        plugins: {
            legend: {
                display: false,
                position: 'top',
            },
        }
    }

    // This is called after the page loads, the user has
    // been authenticated, and before the data for the line
    // graph has been generated.
    useEffect(() => {
        if (user) {
            fetchAndProcessData()
        } 
    }, [user])

    async function fetchAndProcessData() {

        getModuleAnalyticsRecord()
        
        const firebaseDateRecords = await getFirebaseDateRecords()
        const datesForLastSevenDaysFormattedLikeFirebase =
            createListOfDatesForLastSevenDaysFormattedLikeFirebaseDateRecords()
        const datesFormattedForDisplay = 
            createListOfDatesFormattedForDisplay()
        const numberOfStudentsByDayLastSevenDays =
            tallyStudentNumbers(
                datesForLastSevenDaysFormattedLikeFirebase,
                firebaseDateRecords
            )
        setDataObjectsRequiredByGraphingLibrary(
            datesFormattedForDisplay,
            numberOfStudentsByDayLastSevenDays
        )
        setLoading(false)
    }

    // When a module is created, a module analytics record is created.
    // Currently, this stores the number of users who have accepted the
    // lecturer's module invitation. It also contains a sub collection of
    // records recording students who have visited each day.
    async function getModuleAnalyticsRecord() {
        const db = getFirestore()
        const moduleId = router.query.moduleId as string
        const moduleDocRef = doc(db, MODULE_ANALYTICS_RECORDS, moduleId);
        getDoc(moduleDocRef).then((docSnap) => {
            setModuleAnalyticsRecord(docSnap.data() as ModuleAnalyticsRecord)
        })
    }

    // When a student visits the module page, their student id is added a document
    // containing all student ID's of students that have visited the module
    // in a given day. These documents are stored as a sub-collection within
    // each module analytics record. This logic gets the last 7 module analytics
    // records from Firebase, ordered by date
    async function getFirebaseDateRecords(): Promise<DateRecord[]> {
        const db = getFirestore()
        const moduleId = router.query.moduleId as string
        // This is the syntax for getting a nested sub collection.
        // You just specify the name of the sub collection after
        // the location of the parent document
        const dateRecordsCollectionLocation =
            collection( db,
                        MODULE_ANALYTICS_RECORDS,
                        moduleId,
                        DATE_RECORDS
            )
        const q = query(dateRecordsCollectionLocation, orderBy("date", "desc"), limit(7))
        // Set the firebase date records to local state
        const firebaseDateRecords: DateRecord[] = []
        const docs = await getDocs(q)
        docs.forEach((doc) => {
            firebaseDateRecords.push(doc.data() as DateRecord)
        })      
        return firebaseDateRecords
    }

    function createListOfDatesForLastSevenDaysFormattedLikeFirebaseDateRecords(): string[] {
        const datesForLastSevenDaysFormattedLikeFirebase: string[] = []
        let date = new Date()
        for (let i = 0 ; i < 7 ; i++) {
            datesForLastSevenDaysFormattedLikeFirebase
                .push(date.toISOString().substring(0, 10))
            date.setDate(date.getDate() - 1)
        }
        datesForLastSevenDaysFormattedLikeFirebase.reverse()
        return datesForLastSevenDaysFormattedLikeFirebase
    }

    // This method creates two lists of strings. The first list
    // is the list of strings to display in each date slot. The second
    // list is a list of dates from today to the last seven days, which
    // are formatted the same as the records in firebase. There may not
    // be a record in firebase for each day, so instead, each day 
    function createListOfDatesFormattedForDisplay(): string[] {

        const months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ]

        let date = new Date()
        const datesFormattedForDisplay: string[] = []
        date = new Date()
        for (let i = 0 ; i < 7 ; i++) {
            const dateForDisplay = months[date.getMonth()] + " " + date.getDate()
            datesFormattedForDisplay.push(dateForDisplay)
            date.setDate(date.getDate() - 1)
        }
        datesFormattedForDisplay.reverse()
        return datesFormattedForDisplay
    }

    // This method tallies the number of students who have
    // accepted the invitation, and  counts the number of students
    // who have visited the site each day in the last 7 days
    function tallyStudentNumbers(
        datesForLastSevenDaysFormattedLikeFirebase: string[],
        firebaseDateRecords: DateRecord[]
    ): number[] {
        const numberOfStudentsByDayLastSevenDays: number[] = []
        let tempNumUniquesLastSevenDays = 0

        for (const date of datesForLastSevenDaysFormattedLikeFirebase) {
            
            let newStudentNumber = 0
            for (const dateRecord of firebaseDateRecords) {
                if (dateRecord.date == date) {
                    newStudentNumber += dateRecord.studentIds.length
                    tempNumUniquesLastSevenDays += dateRecord.studentIds.length    
                    break
                }
            }
            numberOfStudentsByDayLastSevenDays.push(newStudentNumber)
        }

        // This sets state, and should probably be refactored out
        setNumUniquesLastSevenDays(tempNumUniquesLastSevenDays)

        return numberOfStudentsByDayLastSevenDays
    }

    function setDataObjectsRequiredByGraphingLibrary(
        datesFormattedForDisplay: string[],
        listOfStudentNumbersByDay: number[]
    ) {
        console.log(datesFormattedForDisplay);
        
        setData(
            {
                labels: datesFormattedForDisplay,
                datasets: [
                    {
                        data: listOfStudentNumbersByDay,
                        fill: false,
                        backgroundColor: 'rgb(79, 70, 229)',
                        borderColor: 'rgba(79, 70, 229, 0.2)',
                    },
                ],
            }
        )
    }

    return (

        <ScreenWithLoading loading={loading} >
            <PageLayout
                title="Analytics"
                subtitle={moduleAnalyticsRecord?.moduleName}
            >
                {/* List if statistic numbers */}
                <div className="flex flex-row gap-10 ">
                    {/* Number of total students */}
                    <div>
                        <dt>
                            <div className="absolute bg-indigo-500 rounded-md p-3">
                                <UsersIcon className="h-6 w-6 text-white" aria-hidden="true" />
                            </div>
                            <p className="ml-16 text-sm font-medium text-gray-500">Total Students</p>
                        </dt>
                        <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
                            <p className="text-2xl font-semibold text-gray-900">
                                {
                                moduleAnalyticsRecord
                                ?
                                moduleAnalyticsRecord.studentIds.length
                                :
                                null
                                }
                            </p>
                        </dd>
                    </div>

                    {/* Number of students in last seven days */}
                    <div>
                        <dt>
                            <div className="absolute bg-indigo-500 rounded-md p-3">
                                <CalendarIcon className="h-6 w-6 text-white" aria-hidden="true" />
                            </div>
                            <p className="ml-16 text-sm font-medium text-gray-500">7-Day Unique Users</p>
                        </dt>
                        <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
                            <p className="text-2xl font-semibold text-gray-900">
                                {numUniquesLastSevenDays}
                            </p>
                        </dd>
                    </div>
                </div>

                {/* Line graph of daily unique users over the last seven days */}
                <p className="mb-2 font-medium text-gray-500">
                    Unique Users
                </p>
                <div className="w-full">
                    <Line height={100} data={data} options={options} />
                </div>

            </PageLayout>
        </ScreenWithLoading>

    )

}