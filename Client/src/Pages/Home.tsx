import { useEffect, useState } from "react";
import axios from "axios";
import { UseAuth } from "../context/auth";
import { server } from "../constants/configServer";
import type { HomeStats, IRecentPrediction } from "../constants/interfaces/user";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend} from "recharts";
import Navbar from "../Components/Navbar";
import type { LeaderboardResponse } from "../constants/interfaces/leaderboard";

const Home = () => {
  const { user } = UseAuth();
  const [recentPredictions, setRecentPredictions] = useState<IRecentPrediction[]>([]);
  const [bestPrediction, setBestPrediction] = useState<HomeStats["bestPrediction"] | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardResponse | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchHomeStats = async () => {
      try {
        const res = await axios.get<HomeStats>(`${server}/user/homeStats`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          }
        });
        setRecentPredictions(res.data.recentPrediction);
        setBestPrediction(res.data.bestPrediction);
      } catch (err) {
        console.error("Failed to fetch home stats", err);
      }
    };

    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get<LeaderboardResponse>(`${server}/leaderboard`, {
          params: {
            page: 1,
            limit: 10,
          },
        });
        setLeaderboard(res.data);
      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
      }
    };

    fetchLeaderboard();
    fetchHomeStats();
  }, [user]);

  const styledCard = "bg-white rounded-2xl shadow-md p-6 transition-all duration-300 hover:shadow-lg";

  return (
    <div className="min-h-screen w-full font-sans">
      <div className="bg-[#1E4023] h-[20vh] w-full relative z-10 shadow">
        <Navbar />
      </div>
      <div className="relative -mt-14 px-4 md:px-16 z-20">
        <h2 className="text-3xl font-bold text-white mb-8">
          Welcome back, <span className="text-green-400">{user?.username}</span>!
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {bestPrediction && (
              <div className={styledCard}>
                <h3 className="text-2xl font-semibold text-green-600 mb-3">Your Best Yield Prediction</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800">
                  <p><span className="font-medium">Crop:</span> {bestPrediction.crop}</p>
                  <p><span className="font-medium">State:</span> {bestPrediction.state}</p>
                  <p><span className="font-medium">Yield:</span> {bestPrediction.predictedYield.toFixed(2)}%</p>
                  <p><span className="font-medium">Year:</span> {bestPrediction.crop_year}</p>
                  <p><span className="font-medium">Season:</span> {bestPrediction.season}</p>
                  <p><span className="font-medium">Area:</span> {bestPrediction.area}</p>
                </div>
              </div>
            )}

            {recentPredictions.length > 0 && (
              <div className={styledCard}>
                <h3 className="text-2xl font-semibold text-green-700 mb-6 w-[90%]">Recent Yield Predictions</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={recentPredictions.map(r => ({
                      ...r,
                      createdAt: new Date(r.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric"})
                    }))}
                    margin={{ top: 20, right: 30, left: 5, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="createdAt" angle={-45} textAnchor="end" height={60} />
                    <YAxis domain={[0, 'dataMax + 5']} tickFormatter={(value) => (Math.floor(value * 100) / 100).toFixed(2)} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="predictedYield" stroke="#22c55e" strokeWidth={3} activeDot={{ r: 6 }}/>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            {leaderboard && leaderboard.entries?.length > 0 && (
              <div className="bg-white shadow-lg rounded-2xl p-6 h-full flex flex-col border border-yellow-200">
                <h3 className="text-2xl font-bold text-yellow-800 mb-6 flex items-center gap-2">
                    Top 10 Leaderboard
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-left text-gray-800">
                    <thead className="text-xs uppercase bg-[#1E4023]  text-white rounded">
                      <tr>
                        <th className="px-4 py-3">Rank</th>
                        <th className="px-4 py-3">User</th>
                        <th className="px-4 py-3">Crop</th>
                        <th className="px-4 py-3 text-right">Yield (%)</th>
                      </tr>
                    </thead>
                    <tbody >
                      {leaderboard.entries.map((entry, idx) => (
                        <tr
                          key={idx}
                          className={`transition hover:bg-gray-100 ${
                            idx === 0 ? "bg-green-100 font-semibold" : idx === 1 ? "bg-yellow-100 font-semibold" : idx === 2 ? "bg-red-100 font-semibold" : ""
                          }`}
                        >
                          <td className="px-4 py-3">
                            {`#${idx + 1}`}
                          </td>
                          <td className="px-4 py-3">{entry.username}</td>
                          <td className="px-4 py-3">{entry.crop}</td>
                          <td className="px-4 py-3 text-right text-green-700 font-medium">
                            {entry.predictedYield.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
