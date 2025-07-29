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

export interface PredictionResponse {
  yield: number;
}