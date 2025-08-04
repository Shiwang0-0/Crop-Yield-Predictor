import { Request, Response, NextFunction } from "express";
import { SupportReq } from "../schema/user";

const support = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, crop, state, season } = req.query;

    const query: any = {};

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

export { support };
