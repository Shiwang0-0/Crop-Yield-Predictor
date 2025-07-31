import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from "express";
import { User, UserCrop } from "../schema/user";
import { customError } from "../utils/errors";
import { compare } from "bcrypt"
import { sendtoken } from "../utils/token";
import { authRequest } from "../interfaces/authRequest";

const register = (async(req: Request, res: Response, next: NextFunction)=>{

    try {
        const {username, password} = req.body;

        const user = await User.create({ username, password });

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

const predict=(async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const modelResponse= await fetch("http://localhost:5000/predict",{
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
        const data = await modelResponse.json();
        res.json(data); 
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
            userId: user._id,
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


export {register, login, getProfile, predict, publishPrediction, getRandomData};