import { useContext } from "react";
import { AuthContext } from "../../context/provider";

export default function CheckUser() {

    const { user } = useContext(AuthContext)

    

    return (

        <div>
            {user?user.email:null}
        </div>

    )

}