import { Request } from "express";

export interface authRequest extends Request {
    user?:{
        _id:string,
        email:string
        username:string,
    }
}