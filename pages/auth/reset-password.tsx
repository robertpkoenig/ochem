import Head from 'next/head'
import ResetPasswordCard from '../../components/auth/ResetPasswordCard'

export default function ResetPassword() {
    
    return (
        <>
            <Head>
                <title>Password reset</title>
                <meta name="description" content="send an email to yourself to reset your password" />
            </Head> 

            <main>
                <ResetPasswordCard />
            </main>
        </>
    )
}