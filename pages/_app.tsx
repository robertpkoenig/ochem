import 'tailwindcss/tailwind.css'
import type { AppProps } from 'next/app'
import React from 'react'
import { AuthProvider } from '../context/authContext'
import '../styles/globals.css'
import Head from 'next/head'

/* 
    This is the entry point for the Next.js appliction.
    An 'AuthProvider' class wraps all components of the
    application so that authentication state can be
    shared throughout the application.
*/

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>Ochem.io</title>
            </Head>

            <AuthProvider>
                <Component {...pageProps} />
            </AuthProvider>
        </>
    )
}
export default MyApp
