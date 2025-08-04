import { useEffect, useState } from "react";
import { cropOptions, stateOptions, seasonOptions } from "../constants/cropDetails";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { server } from "../constants/configServer";
import type { LeaderboardEntry, LeaderboardResponse } from "../constants/interfaces/leaderboard";

const Leaderboard = () => {

  const navigate = useNavigate();
  
  const [selectedCrop, setSelectedCrop] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedSeason, setSelectedSeason] = useState<string>("");
  const [leaderboard, setLeaderboard]=useState<LeaderboardEntry[]>([]);
  const [totalPages,setTotalPages]=useState<number>(0);
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const limit = 10;

  useEffect(() => {
    const currentParams = Object.fromEntries(searchParams.entries());
    if (currentParams.page !== "1") {
      setSearchParams({ ...currentParams, page: "1" });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCrop, selectedState, selectedSeason]);

  useEffect(()=>{

    const fetchLeaderBoard=async()=>{
        try {
          const res = await axios.get<LeaderboardResponse>(`${server}/leaderboard`,{
            params: {
              page,
              limit,
              crop: selectedCrop || undefined,
              state: selectedState || undefined,
              season: selectedSeason || undefined,
            },
          });
          console.log("leaderboard: ",res.data);
          setLeaderboard(res.data.entries);
          setTotalPages(res.data.totalPages);
        } catch (err) {
          console.error("Failed to fetch leaderboard", err);
        }
    }
    fetchLeaderBoard();
  },[page,limit,selectedCrop,selectedState,selectedSeason]);

  return (
    <div className="min-h-screen w-full font-sans flex flex-col">
      <div className="absolute top-12 left-12 z-50 bg-white rounded-full p-2 shadow hover:shadow-md transition cursor-pointer" onClick={()=>navigate("/home")}>
        <img src="/home.png" alt="Home" className="w-8 h-8 object-contain" />
      </div>
      <div className="h-[20vh] bg-[#1E4023] text-white text-center items-center px-10 py-6 shadow-lg">
          <h2 className="text-4xl font-bold mb-2 mt-8">Leaderboard</h2>
          <p className="text-md text-gray-200">
            Top predictions are across regions and crops.
          </p>
      </div>
      <div className="flex-1 bg-gray-50 px-6 md:px-12 py-10 overflow-auto">
        <h3 className="text-3xl font-semibold mb-8 text-center text-[#1E4023]">Top Predictions</h3>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="min-w-full table-fixed text-sm text-gray-900 border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-[#1E4023] text-white">
              <tr>
                <th className="px-6 py-3 w-30 text-left">Rank</th>
                <th className="px-6 py-3 w-30 text-left">User</th>
                <th className="px-6 py-3 w-30 text-left align-top">
                  <div className="flex flex-col">
                    <span className="text-white font-medium">Crop</span>
                    <select value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)}
                      className="w-30 mt-1 bg-white text-black border border-gray-300 rounded-full px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-600">
                      <option value="">All</option>
                      {cropOptions.map((crop, idx) => (
                        <option key={idx} value={crop}>{crop}</option>))}
                    </select>
                  </div>
                </th>

                <th className="px-6 py-3 w-30 text-left align-top">
                  <div className="flex flex-col">
                    <span className="text-white font-medium">State</span>
                    <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)}
                      className="w-30 mt-1 bg-white text-black border border-gray-300 rounded-full px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-600">
                      <option value="">All</option>
                      {stateOptions.map((state, idx) => (
                        <option key={idx} value={state}>{state}</option>))}
                    </select>
                  </div>
                </th>

                <th className="px-6 py-3 w-30 text-left align-top">
                  <div className="flex flex-col">
                    <span className="text-white font-medium">Season</span>
                    <select value={selectedSeason} onChange={(e) => setSelectedSeason(e.target.value)}
                      className="w-30 mt-1 bg-white text-black border border-gray-300 rounded-full px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-600">
                      <option value="">All</option>
                      {seasonOptions.map((season, idx) => (
                        <option key={idx} value={season}>{season}</option>))}
                    </select>
                  </div>
                </th>

                <th className="px-6 py-3 w-30 text-left">Predicted Yield (%)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaderboard.length > 0 ? (
                leaderboard.map((entry, index) => {
                  const rank = (page - 1) * 10 + index + 1;
                  return (
                    <tr key={index} className="hover:bg-green-100 transition">
                      <td className="px-6 py-4 w-30 font-semibold text-green-800">{rank}</td>
                      <td className="px-6 py-4 w-30 truncate overflow-hidden max-w-40">{entry.username}</td>
                      <td className="px-6 py-4 w-30 truncate overflow-hidden max-w-40">{entry.crop}</td>
                      <td className="px-6 py-4 w-30 truncate overflow-hidden max-w-40">{entry.state}</td>
                      <td className="px-6 py-4 w-30 truncate overflow-hidden max-w-40">{entry.season}</td>
                      <td className="px-6 py-4 w-30 truncate overflow-hidden max-w-40 font-medium text-green-700">
                        {entry.predictedYield.toFixed(2)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="w-30 text-center px-6 py-6 text-gray-500 font-medium">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
          {leaderboard.length > 0 &&  (<div className="mt-6 flex justify-center gap-6">
            <button
              onClick={() => {
                const current = Object.fromEntries(searchParams.entries());
                setSearchParams({ ...current, page: (page - 1).toString() });
              }}
              disabled={page === 1}
              className={`w-[100px] px-5 py-2 rounded-full font-medium transition-all duration-300
                          ${page === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed":"bg-[#1E4023] text-white hover:bg-green-700"}`}>
              ← Prev
            </button>

              <span className="self-center text-gray-600 font-medium min-w-[120px] text-center inline-block">
                Page {page} of {totalPages}
              </span>


            <button
              onClick={() => {
                const current = Object.fromEntries(searchParams.entries());
                setSearchParams({ ...current, page: (page + 1).toString() });
              }}
              disabled={page >= totalPages}
              className={`w-[100px] px-5 py-2 rounded-full font-medium transition-all duration-300
                          ${page >= totalPages ? "bg-gray-300 text-gray-500 cursor-not-allowed":"bg-[#1E4023] text-white hover:bg-green-700"}`}>
              Next →
            </button>
          </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Leaderboard;