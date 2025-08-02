import { Request, Response, NextFunction } from "express";
import { UserCrop } from "../schema/user";
import { FilterType } from "../interfaces/leaderboard";

const getLeaderboardEntries=async (req:Request, res:Response, next:NextFunction)=>{
    try{
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const filter:FilterType={};
        if (typeof req.query.crop === "string") 
            filter.crop = req.query.crop;

        if (typeof req.query.state === "string") 
            filter.state = req.query.state;

        if (typeof req.query.season === "string") 
            filter.season = req.query.season;

        const skip = (page-1)*limit;

        const [entries, total]= await Promise.all([
            UserCrop.find().find(filter).sort({predictedYield: -1}).skip(skip).limit(limit),
            UserCrop.countDocuments(filter)
        ]);

        const totalPages = Math.ceil(total / limit);
        res.send({entries, totalPages});

    }catch(err){
        next(err);
    }
}

export {getLeaderboardEntries};