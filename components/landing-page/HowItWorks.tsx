const steps = [
    {number: 1, description: "Use the drop-and-drop editor to specify each step of the mechanism"},
    {number: 2, description: "Easily share with students, so they can practice on any browser"},
    {number: 3, description: "View real time data on student content engagement"},
]

function HowItWorks() {
    return (
        <div id="how-it-works" className="relative bg-indigo-50 py-16 sm:py-24 lg:py-32">
            <div className="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl">

                <h2 className="text-base font-semibold tracking-wider text-indigo-600 uppercase">
                    HOW IT WORKS
                </h2>

                <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
                    Create exercises tailored to your module
                </p>

                <div className="mt-12 flex flex-col md:flex-row gap-4 ">

                    {steps.map(step => (
                        <div className="pt-6 flex-1">
                            <div className="flow-root bg-gray-50 rounded-lg px-8 pb-8">
                            <div className="-mt-6">
                                <div>
                                <span className=" h-14 w-14 text-white text-xl font-extrabold inline-flex items-center justify-center bg-indigo-500 rounded-md shadow-lg">
                                    {step.number}
                                </span>
                                </div>
                                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                                    {step.description}
                                </h3>
                            </div>
                            </div>
                        </div>
                    ))}
    
                </div>
            </div>
        </div> 
    )
}

export default HowItWorks

