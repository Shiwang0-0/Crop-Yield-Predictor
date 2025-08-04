interface User{
    _id:string,
    email:string
    username:string
}

interface ProfileResponseInterface{
    success:boolean,
    user:User
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

export type {User, ProfileResponseInterface, IUserCrop, ISupportRequest};