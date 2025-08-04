import type { inputPropsString, SelectPropsOptions } from "../types/forminput"

export interface formData {
    crop: SelectPropsOptions,
    crop_year: inputPropsString,
    season: SelectPropsOptions,
    state: SelectPropsOptions,
    area: inputPropsString,
    rainfall: inputPropsString,
    fertilizer: inputPropsString,
    pesticide: inputPropsString,
}

export interface FormValues {
  crop: string;
  crop_year: string;
  season: string;
  state: string;
  area: string;
  rainfall: string;
  fertilizer: string;
  pesticide: string;
}

export interface PredictionResponse {
  outputYield: number;
  userAvg:number|null; 
  globalAvg:number|null;
}