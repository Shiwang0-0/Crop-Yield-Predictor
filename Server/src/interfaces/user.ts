import { Types } from "mongoose";

interface IUser {
  email: string,
  username: string;
  password: string;
}

interface IUserDocument extends IUser, Document {
    _id: Types.ObjectId;
}

interface IUserCrop {
    email: string,
    username: string;
    crop: string;
    crop_year: string;
    season: string;
    state: string;
    area: string;
    fertilizer: string;
    pesticide: string;
    rainfall: string;
    predictedYield: number;
    createdAt: Date;
    updatedAt?: Date;
}

interface ISupportRequest extends IUserCrop {
  supportType: "financial" | "technical" | "advisory" | "other";
  supportDescription?: string
}

export {IUser, IUserDocument, IUserCrop, ISupportRequest};