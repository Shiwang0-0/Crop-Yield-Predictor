import { Request, Response, NextFunction } from "express";

interface extendedError extends Error{
    statusCode?:number,
    code?:number,
    keyPattern?:Record<string,unknown>
    keyValue?: Record<string, any>;
    path?:string
}

const errorMiddleware = (err: extendedError, req: Request, res: Response, next: NextFunction) => {
    err.message = err.message || "Sorry, please try again.";
    err.statusCode = err.statusCode || 500;

    
    if(err.code === 11000 && err.keyPattern){
        const field = Object.keys(err.keyPattern)[0];
        const value = err.keyValue?.[field];
        err.message = `The ${field} '${value}' already exists.`;
        err.statusCode=409;
    }

    if (err.name === "CastError" && err.path) {
        err.message = `Invalid format for field: ${err.path}`;
        err.statusCode = 400;
    }


    if(process.env.NODE_ENV !== "production"){
        console.log("Error: ",err);
    }

    res.status(err.statusCode).json({
        success:false,
        message: err.message
    })
}

export default errorMiddleware;