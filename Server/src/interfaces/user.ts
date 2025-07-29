import { Types } from "mongoose";

interface IUser {
  username: string;
  password: string;
}

interface IUserDocument extends IUser, Document {
    _id: Types.ObjectId;
}

export {IUser, IUserDocument}