import Head from 'next/head'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import LogInCard from '../../components/auth/LogInCard'
import ScreenWithLoading from '../../components/common/ScreenWithLoading'
import { AuthContext } from '../../context/authContext'
import redirectUserHome from '../../functions/helper/redirectUserToHome'

// Page containing login form
export default function Login() {

    const [loading, setLoading] = useState(true)
    const { user, loginAttempted } = useContext(AuthContext)
    const router = useRouter()

    useEffect(() => {
        // If the user is already logged in,
        // redirect them to their home page
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