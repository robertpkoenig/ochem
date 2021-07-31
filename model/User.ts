import UserType from "../p5/model/UserType";

interface User {

    type: UserType,
    firstName: string,
    lastName: string,
    email: string,
    university: string,
    moduleIds: string[],
    completedReactionIds: string[],
    userId: string

}

export default User