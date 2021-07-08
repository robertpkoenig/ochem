
export default function SignUpCard() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <img
                className="mx-auto h-12 w-auto"
                src="/assets/logo.svg"
                alt="Workflow"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Login
                </a>
            </p>
            </div>
    
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-4" action="#" method="POST">

                    <div className="flex flex-row gap-4">

                        <div>
                            <label htmlFor="first-name" className="text-sm font-medium text-gray-700">
                            First Name
                            </label>
                            <div className="mt-1">
                            <input
                                id="first-name"
                                name="first-name"
                                type="text"
                                autoComplete="given-name"
                                required
                                className="w-full appearance-none px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="last-name" className="text-sm font-medium text-gray-700">
                            Last Name
                            </label>
                            <div className="mt-1">
                            <input
                                id="last-name"
                                name="last-name"
                                type="text"
                                autoComplete="family-name"
                                required
                                className="w-full appearance-none px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            </div>
                        </div>

                    </div>

                    <div>
                        <label htmlFor="university" className="block text-sm font-medium text-gray-700">
                        University
                        </label>
                        <div className="mt-1">
                        <input
                            id="university"
                            name="university"
                            type="text"
                            required
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        </div>
                    </div>


                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email address
                        </label>
                        <div className="mt-1">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        </div>
                    </div>
        
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                        </label>
                        <div className="mt-1">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                            Remember me
                        </label>
                        </div>

                    </div>
        
                    <div>
                        <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                        Sign in
                        </button>
                    </div>
                    </form>
        

                </div>
            </div>
        </div>
    )
}
  