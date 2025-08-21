import type { LeaderboardResponse } from "../constants/interfaces/leaderboard";

export default function HomeLeaderBoard({ leaderboard }: { leaderboard: LeaderboardResponse | null }) {
  if (!leaderboard?.entries?.length) return null;

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 h-full flex flex-col border border-yellow-200">
      <h3 className="text-2xl font-bold text-yellow-800 mb-6">Top 10 Leaderboard</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-800">
          <thead className="text-xs uppercase bg-[#1E4023] text-white">
            <tr>
              <th className="px-4 py-4">Rank</th>
              <th className="px-4 py-4">User</th>
              <th className="px-4 py-4">Crop</th>
              <th className="px-4 py-4 text-right">Yield (%)</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.entries.map((entry, idx) => (
              <tr
                key={idx}
                className={`transition hover:bg-gray-100 ${
                  idx === 0 ? "bg-green-100 font-semibold" :
                  idx === 1 ? "bg-yellow-100 font-semibold" :
                  idx === 2 ? "bg-red-100 font-semibold" : ""
                }`}
              >
                <td className="px-4 py-4">{`#${idx + 1}`}</td>
                <td className="px-4 py-4">{entry.username}</td>
                <td className="px-4 py-4">{entry.crop}</td>
                <td className="px-4 py-4 text-right text-green-700 font-medium">
                  {entry.predictedYield.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
