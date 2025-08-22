import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from "express";
import { SupportReq, User, UserCrop } from "../schema/user.js";
import { customError } from "../utils/errors.js";
import { compare } from "bcrypt"
import { cookieOption, sendtoken } from "../utils/token.js";
import { authRequest } from "../interfaces/authRequest.js";

const hosted_model_url = process.env.SERVER_URL

const register = (async(req: Request, res: Response, next: NextFunction)=>{

    try {
        const {email, username, password} = req.body;

        const user = await User.create({ email, username, password });

        if (!user)
            return next(new customError("Error Creating User", 500));

        sendtoken(res,user,201,"User Created")
    }
    catch(err){
        return next(err);
    }
})

const login=(async(req:Request, res:Response, next:NextFunction)=>{
    try{

        const {username, password}=req.body;
        const user = await User.findOne({username}).select("+password");

        if(!user)
            return next(new customError("Invalid Credentials",401));

        const isPassword= await compare(password, user.password);

        if(!isPassword)
            return next(new customError("Invalid Credentials",401));

        sendtoken(res,user,201,"User Logged in")
    }catch(err){
        return next(err);
    }
})

const getProfile=(async(req:authRequest, res:Response, next:NextFunction)=>{
    try{
        const userId = req.user?._id;
        const user = await User.findById(userId);

        if(!user)
            return next(new customError("User not found",401));
        
        res.status(200).json({
            success:true,
            user:user
        })
    }
    catch(err){
        return next(err);
    }
})

const predict=(async(req:authRequest, res:Response, next:NextFunction)=>{
    try{
        const username = req.user?.username;
        const { crop, season, state}=req.body;

        const modelResponse= await fetch(`${hosted_model_url}/predict`,{
             method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(req.body)
        })
         if (!modelResponse.ok) {
            const text = await modelResponse.text(); // get the HTML or error text
            console.error("Model server error:", text);
            return next(text);
        }
        const predictionData = await modelResponse.json();
        const outputYield = predictionData.yield;

        const userAvgCal = await UserCrop.aggregate([
            {
                $match:{username, crop, season, state}
            },
            {
                $group:{
                    _id:null,
                    userAvg:{$avg:"$predictedYield"}
                }
            }
        ]);

        const userAvg=userAvgCal[0]?.userAvg || null;

        const globalAvgCal = await UserCrop.aggregate([
            {
                $match:{crop, season, state}
            },
            {
                $group:{
                    _id:null,
                    globalAvg:{$avg:"$predictedYield"}
                }
            }
        ]);

        const globalAvg=globalAvgCal[0]?.globalAvg || null;
        console.log(userAvgCal,globalAvgCal);
            
        res.json({outputYield, userAvg, globalAvg}); 
    }
    catch(err){
        console.log("error in response by the model")
        return next(err);
    }
});

const publishPrediction=(async(req:authRequest,res:Response, next:NextFunction)=>{
    try{
        const user= req.user;
        if (!user)
            return next(new customError("User not found",401));
        console.log("publish: ",req.body);
        const { crop, crop_year, season, state, area, rainfall, fertilizer, pesticide, predictedYield } = req.body;
        const newRecord = await UserCrop.create({
            username: user.username,
            email: user.email,
            crop,
            crop_year,
            season,
            state,
            area,
            rainfall,
            fertilizer,
            pesticide,
            predictedYield,
        });

        res.status(201).json({ message: "Published successfully"});
    }catch (err){
        console.error("Error publishing prediction:", err);
        next(err);
    }
});

const publishSupportRequest=async (req:authRequest, res:Response, next:NextFunction)=>{
        try{
            const user= req.user;
            if (!user)
                return next(new customError("User not found",401));

            const existingCount = await SupportReq.countDocuments({ username: user.username });

            if (existingCount >= 3) {
                return next(new customError("You can only create up to 3 support requests.", 400));
            }

            const { crop, crop_year, season, state, area, rainfall, fertilizer, pesticide, predictedYield, supportType, supportDescription } = req.body;
            const newRequest= await SupportReq.create({
                username: user.username,
                email:user.email,
                crop,
                crop_year,
                season,
                state,
                area,
                rainfall,
                fertilizer,
                pesticide,
                predictedYield,
                supportType,
                supportDescription
            })
            res.status(201).json({ message: "Support Request Sent successfully"});
        }
        catch(err){
            console.error("Error publishing Support Request:", err);
            next(err);
        }
}

const homeStats=(async(req:authRequest, res:Response, next:NextFunction)=>{
    try{
        const user= req.user;
        if (!user)
            return next(new customError("User not found",401));
            
        const username = user.username;

        const recentPrediction = await UserCrop.find({username}).sort({createdAt:-1}).limit(5).select("crop predictedYield createdAt").lean();

        const bestPrediction = await UserCrop.findOne({username}).sort({predictedYield:-1}).lean();
        res.send({recentPrediction, bestPrediction});

    }catch(err){
        console.error("soemthing Went Wrong:", err);
        next(err);
    }
})

const logout=(async(req:Request, res:Response, next:NextFunction)=>{
    try{
        res.cookie("val-token","",{...cookieOption,maxAge:0}).json({ message:"Logout Successful" })
    }catch(err){
        next(err);
    }
})

const getRandomData=(async(req:Request, res:Response, next:NextFunction)=>{
    try{
        console.log("mydir: ",__dirname)
        const filePath = path.join(__dirname, '../../../Model/crop_yield.csv');

        const lines = fs.readFileSync(filePath, 'utf8').trim().split('\n');
        const headers = lines[0].split(',');
        const values = lines[Math.floor(Math.random() * (lines.length - 1)) + 1].split(',');

        const row: Record<string, string> = {};
        headers.forEach((key, i) => {
            row[key] = values[i]?.trim() || '';
        });
        console.log("random data: ",row);
        res.json(row);
    }catch(err){
        return next(err);
    }
})


export {register, login, getProfile, homeStats, predict, publishPrediction, publishSupportRequest, logout, getRandomData};