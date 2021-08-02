
import { ChartBarIcon, EyeIcon, PaperAirplaneIcon, PencilIcon } from "@heroicons/react/outline"
import { doc, getFirestore, updateDoc } from "firebase/firestore"
import Link from "next/link"
import React, { useState } from "react"
import { stringify } from "uuid"
import FirebaseConstants from "../../model/FirebaseConstants"
import Module from "../../model/Module"
import { primaryButtonSm, secondaryButtonSm } from "../../styles/common-styles"
import BlueNavBar from "../BlueNavBar"
import ModuleRenamePopup from "./ModuleRenamePopup"
import SharePopup from "./SharePopup"

export interface LayoutProps {
    children: React.ReactNode
    module: Module
}

// This wraps each page in the application
export default function ModuleEditorLayout(props: LayoutProps) {

    const [renamePopupVis, setRenamePopupVis] = useState(false)
    const [title, setTitle] = useState(props.module?.title)
    const [subtitle, setSubtitle] = useState(props.module?.subtitle)
    const [sharePopupVis, setSharePopupVis] = useState<boolean>(false)

    const db = getFirestore()

    function updateModuleTitleAndSubtitle(title: string, subtitle: string) {
        // Create the section record in the module's nested collection of sections

        const moduleRecordDocLocation =
            doc(db,
                FirebaseConstants.MODULES,
                props.module.uuid,
            )

        updateDoc(moduleRecordDocLocation, {
            title: title,
            subtitle: subtitle
        })

        setTitle(title)
        setSubtitle(subtitle)

    }

    function toggleRenamePopup() {
        setRenamePopupVis(!renamePopupVis)
    }

    function toggleSharePopup() {
        setSharePopupVis(!sharePopupVis)
    }

    const buttons = (
        <div className="bg-white rounded-lg shadow px-4 py-3 flex flex-row gap-2">

            <Link href={"/teacher/analytics/" + props.module?.uuid}>
                <a className={secondaryButtonSm}>
                    <ChartBarIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                    Analytics
                </a>
            </Link>
            
            <Link href={"/student/modules/" + props.module?.uuid}>
                <a className={secondaryButtonSm}>
                    <EyeIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                    Preview
                </a>
            </Link>
            <button
            type="button"
            className={primaryButtonSm}
            onClick={() => toggleSharePopup()}
            >
                <PaperAirplaneIcon className="-ml-0.5 mr-1.5 h-4 w-4" aria-hidden="true" />
                Invite Students
            </button>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-indigo-600 pb-32">
                <BlueNavBar />

                {/* Title and subtitle */}
                <header className="py-6">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-row items-center">
                        <div className="flex-grow">
                            <div className="group flex gap-2 items-center justify-start">
                                <h1 className="text-3xl font-bold text-white">{title}</h1>
                                <PencilIcon
                                    className="w-5 h-5 cursor-pointer text-indigo-300
                                             hover:text-indigo-200 invisible group-hover:visible"
                                    onClick={toggleRenamePopup}
                                />
                            </div>
                            <h2 className="text-l font-regular text-white opacity-60">{subtitle}</h2>
                        </div>
                        {buttons}
                    </div>
                </header>
            </div>
        
            <main className="-mt-32">
                    <div className="max-w-5xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
                        <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
                                {props.children}
                        </div>
                    </div>
            </main>

            {/* ModuleRenamePopup */}
            {
                renamePopupVis
                ?
                <ModuleRenamePopup 
                module={props.module} 
                popupCloseFunction={toggleRenamePopup}
                updateModuleFunction={updateModuleTitleAndSubtitle}
                /> 
                :
                null
            }

            {/* Share popup */}
            {
                sharePopupVis
                ?
                <SharePopup
                    popupCloseFunction={toggleSharePopup}
                    moduleId={props.module.uuid}
                />
                :
                null
            }

        </div>

      )
}