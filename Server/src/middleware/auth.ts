import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"
import { User } from "../schema/user.js"
import { customError } from "../utils/errors.js"

const isAuthenticated=async(req:Request, res:Response, next:NextFunction)=>{
    try{
        
        const token = req.cookies["val-token"];
        if (!token) {
            return next(new customError("Login Required",401));
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) 
            return next(new customError("Something Went Wrong",500));
        const decodedToken= jwt.verify(token, secret) as {_id:string}

        const user= await User.findById(decodedToken._id).select("_id username email");
        if(!user)
            return next(new customError("Invalid Credentials",401));

        req.user= {_id: user._id.toString(), email:user.email, username:user.username};

        next();
    }   
    catch(err){
        console.log("authenticated error: ",err);
    }
}

export {isAuthenticated};