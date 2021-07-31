import { NextRouter, useRouter } from "next/router"
import User from "../model/User"
import UserType from "../p5/model/UserType"

export default function redirectUserHome(router: NextRouter, user: User) {

    if (user.type == UserType.TEACHER) {
        router.push("/teacher/modules")
    }

    if (user.type == UserType.STUDENT) {

        if (user.moduleIds.length < 1) {
            alert("You have not been invited to any modules yet")
        }

        if (user.moduleIds.length == 1) {
            router.push("/student/modules/" + user.moduleIds[0])
        }

        else {
            router.push("/student/modules/")
        }
        
    }
}