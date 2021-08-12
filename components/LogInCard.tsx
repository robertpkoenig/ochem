import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useRouter } from "next/router";
import { FormEvent, useContext, useState } from "react";
import { AuthContext } from "../context/provider";
import redirectUserHome from "../helper/redirectUserToHome";
import User from "../model/User";
import UserType from "../p5/model/UserType";
import { primaryButtonMd } from "../styles/common-styles";
import Link from 'next/link'

export default function LogInCard() {

    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');

    const { setUser } = useContext(AuthContext)
    const router = useRouter()

    function onEmailChange(event: FormEvent<HTMLInputElement>) {
        setEmailValue(event.currentTarget.value)
    }

    function onPasswordChange(event: FormEvent<HTMLInputElement>) {
        setPasswordValue(event.currentTarget.value)
    }

    async function onSubmit(event: React.FormEvent) {
        event.preventDefault()
        const auth = getAuth();
        
        signInWithEmailAndPassword(auth, emailValue, passwordValue)
        .then((userCredential) => {
            // User is now signed in
            const db = getFirestore()
            getDoc(doc(db, "users", userCredential.user.uid)).then((docSnap) => {
                const user: User = docSnap.data() as User
                setUser(user)
                redirectUserHome(router, user)
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
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Log in to your account</h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Or{' '}
                    <Link href="/auth/signup">
                        <a className="font-medium text-indigo-600 hover:text-indigo-500">
                            Sign up
                        </a>
                    </Link>
                </p>
            </div>
    
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form
                        onSubmit={onSubmit}
                        className="space-y-6"
                    >

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
                            {/* <button

                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                            Sign in
                            </button> */}
                            <input
                                type="submit"
                                name="submit"
                                value="Log in"
                                className={primaryButtonMd + "w-full flex justify-center cursor-pointer"}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>

    )
}
  