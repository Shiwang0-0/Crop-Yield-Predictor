import jwt from "jsonwebtoken";
import { IUserDocument } from "../interfaces/user";
import { Response } from "express";
import { CookieOptions } from "express";

const cookieOption:CookieOptions={
    maxAge:15*24*60*60*1000,
    sameSite:"none",
    httpOnly:true,
    secure:true
}

const sendtoken=(res:Response ,user:IUserDocument,code:number,message:string)=>{

    const token=jwt.sign({_id:user._id},process.env.JWT_SECRET as string);

    return res.status(code).cookie("val-token",token,cookieOption).json({
        success:true,
        user,
        message,
    })
}

export { cookieOption, sendtoken };