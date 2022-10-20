import { PlayIcon } from "@heroicons/react/24/outline"
import Link from "next/link"

interface IProps {
    toggleVideoPopup: () => void
}

function DescriptionAndCTA(props: IProps) {
    return (
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

                    {/* Sign up link */}
                    <div className="rounded-md shadow">
                        <Link href="/auth/signup" >
                            <a className="w-full hidden md:flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                                Get started
                            </a>
                        </Link>
                    </div>

                    {/* Button to play video demo */}
                    <div className="mt-3 sm:mt-0 sm:ml-3">
                        <button
                            onClick={props.toggleVideoPopup}
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
    )
}

export default DescriptionAndCTA