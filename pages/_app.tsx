import 'tailwindcss/tailwind.css'
import type { AppProps } from 'next/app'
import React from 'react'
import { AuthProvider } from '../context/provider'
import '../styles/globals.css'
import Head from 'next/head'

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
