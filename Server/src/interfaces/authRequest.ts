import { Request } from "express";

interface PredictBody {
    crop:string,
    crop_year:string,
    season:string,
    state:string,
    area:string,
    rainfall:string,
    fertilizer:string,
    pesticide:string,
    predictedYield:string,
    supportType:string, 
    supportDescription:string
}