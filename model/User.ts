import ModuleCompletionRecord from "./ModuleCompletionRecord";

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
    moduleCompletionRecord: ModuleCompletionRecord[]

}

export default User