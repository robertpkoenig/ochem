import { CalendarIcon, ClockIcon, UsersIcon } from "@heroicons/react/outline";
import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import ScreenWithLoading from "../../../components/ScreenWithLoading";
import { Line } from 'react-chartjs-2';
import { collection, doc, getDoc, getDocs, getFirestore, limit, orderBy, query, where } from "firebase/firestore";
import FirebaseConstants from "../../../model/FirebaseConstants";
import { useRouter } from "next/router";
import { AuthContext } from "../../../context/provider";
import ModuleAnalyticsRecord from "../../../model/ModuleAnalyticsRecord";

interface DateRecord {
    date: string,
    studentIds: string[]
}

export default function Analytics() {

    const [loading, setLoading] = useState<boolean>(true)
    const [moduleAnalyticsRecord, setModuleAnalyticsRecord] = useState<ModuleAnalyticsRecord>(null)
    const [dateRecords, setDateRecords] = useState<DateRecord[]>(null)
    const [studentNumbers, setStudentNumbers] = useState<number[]>([])
    const [datesForDataProcessing, setDatesForDataProcessing] = useState<string[]>([])
    const [datesForDisplay, setDatesForDisplay] = useState<string[]>([])
    const [numUniquesLastSevenDays, setNumUniquesLastSevenDays] = useState<number>(0)

    const router = useRouter()
    const { user } = useContext(AuthContext)

    async function getDatesFromFirebase() {
        const db = getFirestore()
        const moduleId = router.query.moduleId as string
        const dateRecordsCollectionLocation =
            collection( db,
                        FirebaseConstants.MODULE_ANALYTICS_RECORDS,
                        moduleId,
                        FirebaseConstants.DATE_RECORDS
            )
        const q = query(dateRecordsCollectionLocation, orderBy("date", "desc"), limit(7))
        getDocs(q).then(docs => {
            const tempDateRecords: DateRecord[] = []
            docs.forEach((doc) => {
                tempDateRecords.push(doc.data() as DateRecord)
            });
            setDateRecords(tempDateRecords)
            setDates()
        })
    }

    async function getModuleAnalyticsRecord() {
        const db = getFirestore()
        const moduleId = router.query.moduleId as string
        const moduleDocRef = doc(db, FirebaseConstants.MODULE_ANALYTICS_RECORDS, moduleId);
        getDoc(moduleDocRef).then((docSnap) => {
            setModuleAnalyticsRecord(docSnap.data() as ModuleAnalyticsRecord)
        })
    }

    useEffect(() => {
        if (user && datesForDisplay.length == 0) {
            getDatesFromFirebase()
            getModuleAnalyticsRecord()
        }
        
    }, [user])

    useEffect(() => {
        if (!dateRecords) return
        const tempStudentNumbers: number[] = []
        let tempNumUniquesLastSevenDays = 0

        for (const date of datesForDataProcessing) {
            
            let newStudentNumber = 0
            for (const dateRecord of dateRecords) {
                if (dateRecord.date == date) {
                    newStudentNumber += dateRecord.studentIds.length
                    tempNumUniquesLastSevenDays += dateRecord.studentIds.length    
                    break
                }
            }
            tempStudentNumbers.push(newStudentNumber)
        }
        setStudentNumbers(tempStudentNumbers)
        setNumUniquesLastSevenDays(tempNumUniquesLastSevenDays)

    }, [dateRecords])

    useEffect(() => {
        if (moduleAnalyticsRecord) {
            setLoading(false)
        }
    }, [moduleAnalyticsRecord, studentNumbers])

    function setDates() {

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

        // Get the dates for matching to the firebase records
        const tempDatesForDataProcessing: string[] = []
        let date = new Date()
        for (let i = 0 ; i < 7 ; i++) {
            tempDatesForDataProcessing.push(date.toISOString().substring(0, 10))
            date.setDate(date.getDate() - 1)
        }
        tempDatesForDataProcessing.reverse()
        setDatesForDataProcessing(tempDatesForDataProcessing)

        console.log(tempDatesForDataProcessing);

        // Get the dates for display
        const tempDatesForDisplay: string[] = []
        date = new Date()
        for (let i = 0 ; i < 7 ; i++) {
            const dateForDisplay = months[date.getMonth()] + " " + date.getDate()
            tempDatesForDisplay.push(dateForDisplay)
            date.setDate(date.getDate() - 1)
        }
        tempDatesForDisplay.reverse()
        setDatesForDisplay(tempDatesForDisplay)

    }

    const data = {
        labels: datesForDisplay,
        datasets: [
        {
            data: studentNumbers,
            fill: false,
            backgroundColor: 'rgb(79, 70, 229)',
            borderColor: 'rgba(79, 70, 229, 0.2)',
        },
        ],
    };

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

    return (

        <ScreenWithLoading loading={loading} >
            <Layout
                title="Analytics"
                subtitle={moduleAnalyticsRecord?.moduleName}
            >
                <div className="flex flex-row gap-10 ">
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

                <p className="mb-2 font-medium text-gray-500">
                    Unique Users
                </p>
                <div className="w-full">
                    <Line height={100} data={data} options={options} />
                </div>

            </Layout>
        </ScreenWithLoading>

    )

}