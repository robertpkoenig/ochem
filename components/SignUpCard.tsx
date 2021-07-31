import Link from "next/link";
import { FormEvent, useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import User from "../model/User";
import UserType from "../p5/model/UserType";
import { useRouter } from "next/router";

export default function SignUpCard() {

    const [firstNameValue, setFirstNameValue] = useState('');
    const [lastNameValue, setLastNameValue] = useState('');
    const [universityValue, setUniversityValue] = useState('');
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    
    function onFirstNameChange(event: FormEvent<HTMLInputElement>) {
        setFirstNameValue(event.currentTarget.value)
    }

    function onLastNameChange(event: FormEvent<HTMLInputElement>) {
        setLastNameValue(event.currentTarget.value)
    }

    function onUniversityChange(event: FormEvent<HTMLInputElement>) {
        setUniversityValue(event.currentTarget.value)
    }

    function onEmailChange(event: FormEvent<HTMLInputElement>) {
        setEmailValue(event.currentTarget.value)
    }

    function onPasswordChange(event: FormEvent<HTMLInputElement>) {
        setPasswordValue(event.currentTarget.value)
    }

    const router = useRouter()

    async function onSubmit(event: React.FormEvent) {
        event.preventDefault()
        const auth = getAuth();
        await createUserWithEmailAndPassword(auth, emailValue, passwordValue)
        .then((userCredential) => {
            // Signed in 
            const db = getFirestore()
            const newUser: User = {
                type: UserType.TEACHER,
                firstName: firstNameValue,
                lastName: lastNameValue,
                email: emailValue,
                university: universityValue,
                moduleIds: [],
                completedReactionIds: [],
                userId: userCredential.user.uid
            }
            setDoc(doc(db, "users", userCredential.user.uid), newUser).then(() => {
                router.push("/teacher/modules")
            })
        })
        .catch((error) => {
            alert(error.message)
        });

    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <img
                className="mx-auto h-12 w-auto"
                src="/assets/logo.svg"
                alt="Workflow"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create teacher account</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/auth/login">
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Login
                    </a>
                </Link>
            </p>
            </div>
    
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form 
                        onSubmit={onSubmit}
                        className="space-y-4"
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
                        <label htmlFor="university" className="block text-sm font-medium text-gray-700">
                            University
                        </label>
                        <div className="mt-1">
                        <input
                            value={universityValue}
                            onChange={onUniversityChange}
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

                    {/* <div className="flex items-center justify-between">
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
                    </div> */}
        
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center mt-6 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            Create account
                        </button>
                    </div>
                    </form>

                </div>
                <p className="mt-6 font-light text-gray-500 text-center text-sm">
                    This sign up form is only for <em><strong>teachers</strong></em>. If you are a student,<br></br>
                    wait for your teacher to send you an invitation link.
                </p>
            </div>
        </div>
    )
}
  