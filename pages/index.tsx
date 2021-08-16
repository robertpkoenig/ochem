/*
    This is the landing page for Ochem.io
*/

import Link from 'next/link'
import React, { useState } from 'react'
import { Popover } from '@headlessui/react'
import {
    PencilAltIcon,
    GlobeIcon,
    ChartBarIcon,
    PlayIcon,
    FolderIcon
  } from '@heroicons/react/outline'
import VideoPopup from '../components/VideoPopup'

// List of navigation links shown on top left of screen.
// They point to anchor links lower down the page.
const navigation = [
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'Features', href: '#features' },
]

// List of features shown in the second panel of the page
const features = [
    {   
        name: 'Intuitive Editor',
        icon: PencilAltIcon,
        text: "Simply point and click to add atoms and bonds. For each reaction step, you specify the required curly arrow" 
    },
    {   
        name: 'Easily Accessible',
        icon: GlobeIcon,
        text: "Students can easily access content from any internet browser. Simply share your class link."
    },
    { 
        name: 'Analytics',
        icon: ChartBarIcon,
        text: "View real time student interaction to see how useful the system is."
    },
]

export default function Example() {

    const [videoPopupVis, setVideoPopupVis] = useState<boolean>(false)

    function toggleVideoPopup() {
        setVideoPopupVis(!videoPopupVis)
    }

    return (
    <div>
        {/* The top panel containing logo, navigation, call to action, demo video button, and artwork */}
        <div className="relative bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-3xl lg:w-full lg:pb-28 xl:pb-32">
                    {/* The angled white boundary between the landing page photo and CTA/Nav/Logo */}
                    <svg
                        className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
                        fill="currentColor"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        <polygon points="50,0 100,0 50,100 0,100" />
                    </svg>

                    {/* Logo and navigation (on mobile navigation dissappears) */}
                    <Popover>
                        {({ open }) => (
                            <>
                                <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
                                    <nav
                                        className="relative flex items-center justify-between sm:h-10 lg:justify-start"
                                        aria-label="Global"
                                    >
                                        <div className="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
                                        <div className="flex items-center justify-between w-full md:w-auto">
                                            <a href="#">
                                            <span className="sr-only">Workflow</span>
                                            <div className="h-full">
                                                <img src="./assets/logo-with-text.svg" alt="logo" className="h-9"/>
                                            </div>
                                            </a>
                                        </div>
                                        </div>
                                        <div className="hidden md:block md:ml-10 md:pr-4 md:space-x-8">
                                        {navigation.map((item) => (
                                            <Link href={item.href}>
                                                <a key={item.name} className="font-medium text-gray-500 hover:text-gray-900">
                                                    {item.name}
                                                </a>
                                            </Link>
                                        ))}
                                        <Link href="/auth/login">
                                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                                Login
                                            </a>
                                        </Link>
                                        </div>
                                    </nav>
                                </div>
                            </>
                        )}
                    </Popover>

                    {/* Lead text, and app description */}
                    <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                        <div className="sm:text-center lg:text-left">
                            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                                <span className="block">Create interactive</span>
                                <span className="block text-indigo-600">arrow pushing</span>
                                <span className="block text-indigo-600">exercises</span>
                            </h1>
                            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                Help students reinforce critical organic chemistry <br></br>concepts with engaging interactive content
                            </p>
                            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                {/* Top call to action */}
                                <div className="rounded-md shadow">
                                    <Link href="/auth/signup">
                                        <a
                                            href="#"
                                            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                                        >
                                            Get started
                                        </a>
                                    </Link>
                                </div>
                                {/* Button to play video demo */}
                                <div className="mt-3 sm:mt-0 sm:ml-3">
                                    <button
                                        onClick={toggleVideoPopup}
                                        className="w-full flex gap-2 items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
                                    >
                                        <PlayIcon className="w-6 h-6" />
                                        <div>
                                            Intro
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Photo on top right of page */}
            <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                <img
                    className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
                    src="/assets/images/woman-with-laptop.jpg"
                    alt=""
                />
            </div>
        </div>

        {/* Second panel, 'how it works' */}
        <div id="how-it-works" className="relative bg-indigo-50 py-16 sm:py-24 lg:py-32">
            <div className="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl">
                <h2 className="text-base font-semibold tracking-wider text-indigo-600 uppercase">
                    HOW IT WORKS
                </h2>
                <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
                    Create exercises tailored to your module
                </p>
                <div className="mt-12 flex flex-col gap-4 md:flex-row ">
                    {/* Step 1 */}
                    <div className="pt-6 flex-1">
                        <div className="flow-root bg-gray-50 rounded-lg px-8 pb-8">
                        <div className="-mt-6">
                            <div>
                            <span className=" h-14 w-14 text-white text-xl font-extrabold inline-flex items-center justify-center bg-indigo-500 rounded-md shadow-lg">
                                1
                            </span>
                            </div>
                            <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                                Use the drop-and-drop editor to specify each step of the mechanism
                            </h3>
                            <p className="mt-5 text-base text-gray-500">
                                
                            </p>
                        </div>
                        </div>
                    </div>
                    {/* Step 2 */}
                    <div className="pt-6 flex-1">
                        <div className="flow-root bg-gray-50 rounded-lg px-8 pb-8">
                        <div className="-mt-6">
                            <div>
                            <span className=" h-14 w-14 text-white text-xl font-extrabold inline-flex items-center justify-center bg-indigo-500 rounded-md shadow-lg">
                                2
                            </span>
                            </div>
                            <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                                Easily share with students, so they can practice on any browser
                            </h3>
                            <p className="mt-5 text-base text-gray-500">
                                
                            </p>
                        </div>
                        </div>
                    </div>
                    {/* Step 3 */}
                    <div className="pt-6 flex-1">
                        <div className="flow-root bg-gray-50 rounded-lg px-8 pb-8">
                        <div className="-mt-6">
                            <div>
                            <span className=" h-14 w-14 text-white text-xl font-extrabold inline-flex items-center justify-center bg-indigo-500 rounded-md shadow-lg">
                                3
                            </span>
                            </div>
                            <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                                View real time data on student <br></br>content engagement
                            </h3>
                            <p className="mt-5 text-base text-gray-500">
                                
                            </p>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* List of features with accompanying screenshots */}
        <div id="features" className="relative bg-white pt-16 pb-32 overflow-hidden">

        {/* Editor */}
            <div className="relative">
                <div className="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:grid-flow-col-dense lg:gap-24">
                    <div className="px-4 max-w-xl mx-auto sm:px-6 lg:py-36 lg:max-w-none lg:mx-0 lg:px-0">
                        <div>
                            <div>
                                <span className="h-12 w-12 rounded-md flex items-center justify-center bg-indigo-600">
                                    <PencilAltIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                </span>
                            </div>
                            <div className="mt-6">
                                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                                    Intuitive editor
                                </h2>
                                <p className="mt-4 text-lg text-gray-500">
                                    Drag and drop atoms, create bonds, and specify curly arrows. Create a prompt for the reaction.
                                    Ochem then generates the student interaction, with feedback for each arrow they draw.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 sm:mt-16 lg:mt-0">
                        <div className="pl-4 -mr-48 sm:pl-6 md:-mr-16 lg:px-0 lg:m-0 lg:relative lg:h-full">
                            <img
                                className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                                src="/assets/screenshots/editor.png"
                                alt="Inbox user interface"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Organization */}
            <div className="mt-24">
                <div className="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:grid-flow-col-dense lg:gap-24">
                    <div className="px-4 max-w-xl mx-auto sm:px-6 lg:py-36 lg:max-w-none lg:mx-0 lg:px-0 lg:col-start-2">
                        <div>
                            <div>
                                <span className="h-12 w-12 rounded-md flex items-center justify-center bg-indigo-600">
                                    <FolderIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                </span>
                            </div>
                            <div className="mt-6">
                                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                                    Exercise collections
                                </h2>
                                <p className="mt-4 text-lg text-gray-500">
                                    Group mechanisms into sections. Control which sections and reactions are visible to students.
                                    Students can keep track of their progress.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 sm:mt-16 lg:mt-0 lg:col-start-1">
                        <div className="pr-4 -ml-48 sm:pr-6 md:-ml-16 lg:px-0 lg:m-0 lg:relative lg:h-full">
                            <img
                                className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:right-0 lg:h-full lg:w-auto lg:max-w-none"
                                src="/assets/screenshots/organize.png"
                                alt="Customer profile user interface"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Analytics */}
            <div className="relative mt-24">
                <div className="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:grid-flow-col-dense lg:gap-24">
                    <div className="px-4 max-w-xl mx-auto sm:px-6 lg:py-36 lg:max-w-none lg:mx-0 lg:px-0">
                        <div>
                            <div>
                                <span className="h-12 w-12 rounded-md flex items-center justify-center bg-indigo-600">
                                    <ChartBarIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                </span>
                            </div>
                            <div className="mt-6">
                                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                                    Engagement Analytics
                                </h2>
                                <p className="mt-4 text-lg text-gray-500">
                                    You don&apos;t want to spend time creating study aids that students never use. With Ochem, you can
                                    see how many students are accessing content.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 sm:mt-16 lg:mt-0">
                        <div className="pl-4 -mr-48 sm:pl-6 md:-mr-16 lg:px-0 lg:m-0 lg:relative lg:h-full">
                            <img
                                className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                                src="/assets/screenshots/analytics.png"
                                alt="Inbox user interface"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-indigo-50">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                    <span className="block">Ready to dive in?</span>
                    <span className="block text-indigo-600">Ochem is free!</span>
                </h2>
                <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                    <div className="inline-flex rounded-md shadow">
                        <Link href="/auth/signup">
                            <a
                            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Get started
                            </a>
                        </Link>
                    </div>
                    <div className="ml-3 inline-flex rounded-md shadow">
                        <button
                            onClick={toggleVideoPopup}
                            className="flex gap-1 items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
                        >
                            <PlayIcon className="w-6 h-6" />
                            <div>
                                Intro
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {
            videoPopupVis
            ?
            <VideoPopup popupCloseFunction={toggleVideoPopup} />
            :
            null
        }

    </div>
  )
}
