import { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../constants/configServer";
import type { HomeStats, IRecentPrediction } from "../constants/interfaces/user";

export const useHomeStats = (userEmail?: string) => {
  const [recentPredictions, setRecentPredictions] = useState<IRecentPrediction[]>([]);
  const [bestPrediction, setBestPrediction] = useState<HomeStats["bestPrediction"] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userEmail) return;

    const fetchHomeStats = async () => {
      try {
        setLoading(true);
        const res = await axios.get<HomeStats>(`${server}/api/user/homeStats`, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
        setRecentPredictions(res.data.recentPrediction);
        setBestPrediction(res.data.bestPrediction);
      } catch (err) {
        console.error("Failed to fetch home stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeStats();
  }, [userEmail]);

  return { recentPredictions, bestPrediction, loading };
};
