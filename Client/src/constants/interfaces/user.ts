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
    _id: string,
  supportType: "financial" | "technical" | "advisory" | "other";
  supportDescription?: string
}

export const typeColors: Record<ISupportRequest["supportType"], string> = {
  financial: "bg-green-300 text-green-800",
  technical: "bg-blue-300 text-blue-800",
  advisory: "bg-red-300 text-purple-800",
  other: "bg-yellow-300 text-yellow-800",
};

interface IRecentPrediction {
    _id: string,
    crop: string,
    predictedYield: number,
    createdAt: Date,
    loading:boolean
}

interface HomeStats {
    bestPrediction: IUserCrop;
    recentPrediction: IRecentPrediction[];
}

export type {User, ProfileResponseInterface, IUserCrop, ISupportRequest, IRecentPrediction, HomeStats};