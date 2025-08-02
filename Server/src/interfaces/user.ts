import { Types } from "mongoose";

interface IUser {
  username: string;
  password: string;
}

interface IUserDocument extends IUser, Document {
    _id: Types.ObjectId;
}

interface IUserCrop {
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
    createdAt?: Date;
    updatedAt?: Date;
}

export {IUser, IUserDocument, IUserCrop};