import { FormEvent, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { arrayUnion, doc, DocumentSnapshot, getDoc, getFirestore, setDoc } from 'firebase/firestore'
import { AuthContext } from '../../../context/provider'
import ScreenWithLoading from '../../../components/ScreenWithLoading'
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import UserType from '../../../p5/model/UserType'
import User from '../../../model/User'
import Image from 'next/image'
import FirebaseConstants from '../../../model/FirebaseConstants'
import ModuleListing from '../../../model/ModuleListing'

export default function Invitation() {

    const [loading, setLoading] = useState<boolean>(true)
    const [moduleId, setModuleId] = useState<string>('')
    const [moduleListing, setModuleListing] = useState<ModuleListing>(null)

    const [firstNameValue, setFirstNameValue] = useState('');
    const [lastNameValue, setLastNameValue] = useState('');
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');

    function onFirstNameChange(event: FormEvent<HTMLInputElement>) {
        setFirstNameValue(event.currentTarget.value)
    }
    function onLastNameChange(event: FormEvent<HTMLInputElement>) {
        setLastNameValue(event.currentTarget.value)
    }
    function onEmailChange(event: FormEvent<HTMLInputElement>) {
        setEmailValue(event.currentTarget.value)
    }
    function onPasswordChange(event: FormEvent<HTMLInputElement>) {
        setPasswordValue(event.currentTarget.value)
    }
    
    const { user } = useContext(AuthContext)
    const { loginAttempted } = useContext(AuthContext)

    const router = useRouter()

    async function getData() {
        const db = getFirestore()

        const moduleIdParam = router.query.moduleId as string
        setModuleId(moduleIdParam)
        const moduleDoc = await getDoc(doc(db, FirebaseConstants.MODULE_LISTINGS, moduleIdParam))
        setModuleListing(moduleDoc.data() as ModuleListing)
        setLoading(false)
    }

    useEffect(() => {
    if (loginAttempted) {
            if (user) {
                router.push('/student/modules/' + router.query.moduleId)
            }
            else {
                getData()
            }
        }
    }, [loginAttempted])

    async function onSubmit(event: React.FormEvent) {
        setLoading(true)
        event.preventDefault()
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, emailValue, passwordValue)
            .then((userCredential) => {
                // Signed in 
                const db = getFirestore()
                const newUser: User = {
                    type: UserType.STUDENT,
                    firstName: firstNameValue,
                    lastName: lastNameValue,
                    email: emailValue,
                    university: "",
                    moduleIds: [moduleId],
                    completedReactionIds: [],
                    userId: userCredential.user.uid
                }
                setDoc(doc(db, "users", userCredential.user.uid), newUser).then(() => {
                    router.push("/student/modules/" + moduleId)
                })
                setDoc(doc(db, FirebaseConstants.MODULE_ANALYTICS_RECORDS, moduleId), {
                    studentIds: arrayUnion(userCredential.user.uid)
                })
            })
            .catch((error) => {
                setLoading(false)
                alert(error.message)
            });
    }

    return (
        <ScreenWithLoading loading={loading}>
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                
                <div className="sm:mx-auto ">
                    <img
                        className="mx-auto h-12 w-auto"
                        src="/assets/logo.svg"
                        alt="Workflow"
                    />
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create account to access module</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link href="/auth/login">
                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Login
                            </a>
                        </Link>
                    </p>
                </div>
        
                <div className="mt-8 mx-auto">

                    <div className="bg-white shadow rounded-lg flex flex-row ">

                        <div className="bg-indigo-600 rounded-tl-lg rounded-bl-lg p-10 text-white flex flex-col justify-between ">

                            <div className="flex flex-col gap-2">
                                <span className="text-2xl font-bold">
                                    {moduleListing?.name}
                                </span>
                            </div>

                            <div className="text-l font-light">
                                {moduleListing?.authorName}
                            </div>

                        </div>

                        <form
                            onSubmit={onSubmit}
                            className="space-y-6 p-10 sm:w-full sm:max-w-md"
                        >

                            <div className="flex flex-row gap-4">

                            <div>
                                <label htmlFor="first-name" className="text-sm font-medium text-gray-700">
                                    First Name
                                </label>
                                <div className="mt-1">
                                <input
                                    value={firstNameValue}
                                    onChange={onFirstNameChange}
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
                                    value={lastNameValue}
                                    onChange={onLastNameChange}
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
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email address
                                </label>
                                <div className="mt-1">
                                <input
                                    value={emailValue}
                                    onChange={onEmailChange}
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
                                    value={passwordValue}
                                    onChange={onPasswordChange}
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
                                <div className="text-sm">
                                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    Forgot your password?
                                </a>
                                </div>
                            </div>
                
                            <div>
                                <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    Create account
                                </button>
                            </div>
                        </form>
            

                    </div>
                </div>
            </div>
        </ScreenWithLoading>
    )

}
