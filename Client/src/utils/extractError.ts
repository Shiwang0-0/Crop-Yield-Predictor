import axios from "axios";

export const extractError=(err:unknown, fallback="Something went wrong"):string=>{
    if(axios.isAxiosError(err)){
        return err.response?.data?.message || fallback;
    }
    if(err instanceof Error){
        return err.message;
    }
    return fallback;
}