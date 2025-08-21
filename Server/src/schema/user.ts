import mongoose, { Schema, HydratedDocument, model, Types } from "mongoose";
import {isError} from "../utils/errors";
import bcrypt from 'bcrypt';
import { IUser, IUserCrop, ISupportRequest } from "../interfaces/user";
import { customError } from "../utils/errors";


const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select:false
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

const userCrop= new Schema<IUserCrop>({
    email: {
        type: String,
        ref:"User",
        required:true
    },
    username:{
        type:String,
        ref:"User",
        required:true
    },
    crop: { type: String, required: true },
    crop_year: { type: String, required: true },
    season: { type: String, required: true },
    state: { type: String, required: true },
    area: { type: String, required: true },
    fertilizer: { type: String, required: true },
    pesticide: { type: String, required: true },
    rainfall: { type: String, required: true },
    predictedYield: { type: Number, required: true }
    },
    {
        timestamps:true
    }
);

export const UserCrop = mongoose.models.userCrop || model("UserCrop",userCrop);

const supportRequest= new Schema<ISupportRequest>({
    email: {
        type: String,
        ref:"User",
        required:true
    },
    username:{
        type:String,
        ref:"User",
        required:true
    },
    crop: { type: String, required: true },
    crop_year: { type: String, required: true },
    season: { type: String, required: true },
    state: { type: String, required: true },
    area: { type: String, required: true },
    fertilizer: { type: String, required: true },
    pesticide: { type: String, required: true },
    rainfall: { type: String, required: true },
    predictedYield: { type: Number, required: true },
    supportType: { 
        type:String, 
        enum: ["financial", "technical", "advisory", "other"],
        required:true
    },
    supportDescription: { type: String }
    },
    {
        timestamps:true
    }
)

supportRequest.pre("save", async function (next) {
  const SupportReq = mongoose.model<ISupportRequest>("SupportReq", supportRequest);

    try{
        const count = await SupportReq.countDocuments({ email: this.email });
        if (count >= 3) {
            return next(new customError("You can only create up to 3 support requests.", 400));
        }
        next();
    }
    catch(err:unknown){
        const error=isError(err);
        next(new Error(error.message));
    }

});

export const SupportReq = mongoose.models.supportRequest || model("SupportReq",supportRequest);
