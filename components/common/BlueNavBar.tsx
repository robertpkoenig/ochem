import React, { useContext } from "react"
import { AuthContext } from "../../context/authContext"
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import UserType from "../../canvas/model/UserType"
import { useRouter } from "next/router"
import { getAuth } from "firebase/auth"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const profile = ['Your Profile', 'Settings', 'Sign out']

interface dropDownOption {
    optionText: string,
    optionFunction: () => void
}

/** The blue area at the top of each app screen */
export default function BlueNavBar() {

    const { user, setUser, setLoginAttempted } = useContext(AuthContext)
    const router = useRouter()

    function signOut() {
        const auth = getAuth()
        setUser(null)
        setLoginAttempted(false)
        auth.signOut()
        router.push("/")
    }

    const dropDownOptions: dropDownOption[] = [
        {
            optionText: "Sign out",
            optionFunction: signOut
        }
    ]

    function routeUserHome() {
        // If it's a student, only go to modules when they have more than one module
        if (user.type == UserType.STUDENT) {
            if (user.moduleIds.length > 1) {
                router.push("/student/modules")
            }
        }
        if (user.type == UserType.TEACHER) {
            router.push("/teacher/modules")
        }
    }

    return (

        <Disclosure as="nav" className="bg-indigo-600 border-b border-indigo-200 border-opacity-25 lg:border-none">
            <div className="max-w-5xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="relative h-16 flex items-center justify-between lg:border-b lg:border-indigo-300 lg:border-opacity-25">
                <div className="px-2 flex items-center lg:px-0">
                    <div className="flex-shrink-0 cursor-pointer" onClick={routeUserHome}>
                        <img
                            className="h-8 w-auto"
                            src="/assets/logo-with-text-white.svg"
                            alt="Ochem.io"
                        />
                    </div>
                </div>
                
                <div className="lg:ml-4">
                <div className="flex items-center">

                    {/* Profile dropdown */}
                    <Menu as="div" className="ml-3 relative flex-shrink-0">
                    {({ open }) => (
                        <>
                        <div>
                            <Menu.Button className="bg-indigo-600 rounded-full flex text-sm text-indigo-100 font-light items-center gap-2">
                            <span className="sr-only">Open user menu</span>
                            { user ? (user.firstName + " " + user.lastName) :  null }
                            {/* Profile image */}
                            {/* <img
                                className="rounded-full h-8 w-8"
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                alt=""
                            /> */}
                            </Menu.Button>
                        </div>
                        <Transition
                            show={open}
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items
                                static
                                className="origin-top-right absolute w-24 right-0 mt-2 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                            >
                            {dropDownOptions.map((option) => (
                                <Menu.Item key={option.optionText}>
                                {({ active }) => (
                                    <button
                                    onClick={option.optionFunction}
                                    className={classNames(
                                        active ? 'bg-gray-100' : '',
                                        'block py-2 px-4 text-left text-sm text-gray-700 w-full'
                                    )}
                                    >
                                    {option.optionText}
                                    </button>
                                )}
                                </Menu.Item>
                            ))}
                            </Menu.Items>
                        </Transition>
                        </>
                    )}
                    </Menu>
                </div>
                </div>
            </div>
            </div>
        </Disclosure>

    )

}