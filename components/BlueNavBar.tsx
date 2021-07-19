import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const profile = ['Your Profile', 'Settings', 'Sign out']

export default function BlueNavBar() {

    return (

        <Disclosure as="nav" className="bg-indigo-600 border-b border-indigo-200 border-opacity-25 lg:border-none">
            <div className="max-w-5xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="relative h-16 flex items-center justify-between lg:border-b lg:border-indigo-300 lg:border-opacity-25">
                <div className="px-2 flex items-center lg:px-0">
                <div className="flex-shrink-0">
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
                            <Menu.Button className="bg-indigo-600 rounded-full flex text-sm text-white">
                            <span className="sr-only">Open user menu</span>
                            <img
                                className="rounded-full h-8 w-8"
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                alt=""
                            />
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
                            className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                            >
                            {profile.map((item) => (
                                <Menu.Item key={item}>
                                {({ active }) => (
                                    <a
                                    href="#"
                                    className={classNames(
                                        active ? 'bg-gray-100' : '',
                                        'block py-2 px-4 text-sm text-gray-700'
                                    )}
                                    >
                                    {item}
                                    </a>
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