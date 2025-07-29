interface User{
    _id:string,
    username:string
}

interface ProfileResponseInterface{
    success:Boolean,
    user:User
}

export type {User, ProfileResponseInterface};