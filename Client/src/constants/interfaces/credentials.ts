export interface credentials{
    username:string,
    password:string,
    confirmPassword?:string,
}

export interface credentialErrors{
    username?:string,
    password?:string,
    confirmPassword?:string,
}