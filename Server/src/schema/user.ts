import mongoose, { Schema, HydratedDocument, model, Types } from "mongoose";
import {isError} from "../utils/errors";
import bcrypt from 'bcrypt';
import { IUser } from "../interfaces/user";


const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        // select:false
    },
},
    {
        timestamps: true
    }
);

userSchema.pre('save',async function(next){

    const user= this as HydratedDocument<IUser>;

    if(!user.isModified('password'))
        return next();
    try{
        const rounds=10;
        user.password= await bcrypt.hash(user.password,rounds);
        next();
    }catch(err:unknown){
        const error=isError(err);
        next(new Error(error.message));
    }
})

export const User=mongoose.models.User || model("User",userSchema)
