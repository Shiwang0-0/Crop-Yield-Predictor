interface User{
    _id:string,
    username:string
}

interface ProfileResponseInterface{
    success:boolean,
    user:User
}

export type {User, ProfileResponseInterface};