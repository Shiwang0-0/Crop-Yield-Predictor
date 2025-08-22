import axios from 'axios';
import {server} from "../constants/configServer"

export const getRandomData = async (): Promise<{
  crop: string;
  crop_year: string;
  season: string;
  state: string;
  area: string;
  rainfall: string;
  fertilizer: string;
  pesticide: string;
}> => {
  const { data } = await axios.get(`${server}/api/user/randomData`, { withCredentials: true });

  return {
    crop: data.Crop,
    crop_year: data.Crop_Year,
    season: data.Season,
    state: data.State,
    area: data.Area,
    rainfall: data.Annual_Rainfall,
    fertilizer: data.Fertilizer,
    pesticide: data.Pesticide,
  };
};
