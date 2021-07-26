import { auth } from "firebase-admin"
import { GetServerSideProps } from "next"
import nookies from "nookies"
import { verifyIdToken } from "../../firebaseAdmin"

// This is what the tutorial said for server side authentication
// However, it's not clear how exactly the 
export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const cookies = nookies.get(context)
        const token = await verifyIdToken(cookies.token)
        return {
            props: {
                token: token
            }
        }
    }
    catch(error) {
        throw new Error(error)
    }
}

interface IProps {
    token: auth.DecodedIdToken
}