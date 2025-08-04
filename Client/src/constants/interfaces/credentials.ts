export interface credentials{
    email:string,
    username:string,
    password:string,
    confirmPassword?:string,
}

export interface credentialErrors{
    email?:string,
    username?:string,
    password?:string,
    confirmPassword?:string,
}