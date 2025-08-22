import { Request, Response, NextFunction } from "express";
import { SupportReq } from "../schema/user.js";
import { customError } from "../utils/errors.js";

const allSupportReq = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const { page = "1", limit = "10", crop, state, season } = req.query as {
      page?: string;
      limit?: string;
      crop?: string;
      state?: string;
      season?: string;
    };

    const query: Record<string, unknown> = {};

    if (crop) query.crop = crop;
    if (state) query.state = state;
    if (season) query.season = season;

    const totalEntries = await SupportReq.countDocuments(query);

    const entries = await SupportReq.find(query)
      .sort({ createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit);

    res.status(200).json({
      entries,
      totalPages: Math.ceil(totalEntries / +limit),
      currentPage: +page,
    });
  } catch (err) {
    console.error("Error Fetching Support Requests:", err);
    next(err);
  }
};

const userSupportReq = async(req: Request, res: Response, next:NextFunction)=>{
  try{
      const user= req.user;
      if(!user)
        return next(new customError("User not found",401));
            
      const username = user.username;
      
      const supportReq= await SupportReq.find({username}).sort({createdAt:-1});
      console.log("user support req: ",supportReq);
      res.status(200).json(supportReq);

  }
  catch (err) {
    console.error("Error Fetching Support Requests:", err);
    next(err);
  }
}

export { allSupportReq , userSupportReq };
