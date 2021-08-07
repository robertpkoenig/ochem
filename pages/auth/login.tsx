import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import LogInCard from '../../components/LogInCard'
import ScreenWithLoading from '../../components/ScreenWithLoading'
import { AuthContext } from '../../context/provider'
import redirectUserHome from '../../helper/redirectUserToHome'
import UserType from '../../p5/model/UserType'

export default function Login() {

    const [loading, setLoading] = useState(true)
    // if the person is already logged in, go to their page
    const { user, loginAttempted } = useContext(AuthContext)
    const router = useRouter()

    useEffect(() => {
        if (loginAttempted) {
            if (user) {
                redirectUserHome(router, user)
            }
            else {
                setLoading(false) 
            }
        }
    }, [loginAttempted, user, router])


    return (
            <>
                <Head>
                    <title>Login</title>
                    <meta name="description" content="Login to your teacher or student Ochem account." />
                </Head>

                <main>
                    <ScreenWithLoading loading={loading}>
                        <LogInCard />
                    </ScreenWithLoading>
                </main>
            </>
    )
}