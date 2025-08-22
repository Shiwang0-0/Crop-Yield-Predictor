import { useState, useEffect } from "react"
import axios from "axios";
import type { ISupportRequest } from "../constants/interfaces/user";
import { server } from "../constants/configServer";

export const useSupportRequests = () => {

    const [loading, setLoading]=useState(true);
    const [supportRequests, setSupportRequests]= useState<ISupportRequest[]>([]);

    useEffect(()=>{
        const userSupportRequest = async () => {
            try {
                setLoading(true);
                const res = await axios.get<ISupportRequest[]>(`${server}/api/user/user-support-request`,{
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
                });
                setSupportRequests(res.data);
            } catch (err) {
                console.error("Failed to fetch leaderboard", err);
            } finally {
                setLoading(false);
            }
        };
        userSupportRequest();
    },[]);

    return {loading, supportRequests};
}