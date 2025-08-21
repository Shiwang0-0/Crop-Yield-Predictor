import { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../constants/configServer";
import type { LeaderboardResponse } from "../constants/interfaces/leaderboard";

export const useLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading]=useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const res = await axios.get<LeaderboardResponse>(`${server}/leaderboard`,{
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
        setLeaderboard(res.data);
      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return {leaderboard, loading};
};
