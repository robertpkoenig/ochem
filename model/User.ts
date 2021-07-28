
enum UserType {
    student = "student",
    teacher = "teacher"
}

interface User {

    type: UserType,
    firstName: string,
    lastName: string,
    email: string,
    moduleIds: string[],
    completedReactionIds: string[],
    userId: string

}

export default User