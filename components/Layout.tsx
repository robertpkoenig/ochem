
import React from "react"
import BlueNavBar from "./BlueNavBar"

export interface LayoutProps {
    children: React.ReactNode
    title: string
    subtitle?: string
    headerElement?: React.ReactNode
}

// This wraps each page in the application
export default function Layout(props: LayoutProps) {

    const subtitle = props.subtitle ?
        <p className="text-l font-regular text-white opacity-60">{props.subtitle}</p>
        : null

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-indigo-600 pb-32">
                <BlueNavBar />

                {/* Title and subtitle */}
                <header className="py-10">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-row justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white">{props.title}</h1>
                            {subtitle}
                        </div>
                        <div>
                            {props.headerElement?props.headerElement:null}
                        </div>
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
        </div>
      )
}