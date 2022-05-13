import { NextRouter } from "next/router"
import User from "../../persistence-model/User"
import UserType from "../../canvas/model/UserType"

// If the user is a teacher, always redirect to the teacher's modules page.
// If the user is a student with only only module, redirect to that module,
// otherwise redirect to the student's modules page.
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