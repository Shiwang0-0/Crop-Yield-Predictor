import { useEffect, useState } from "react";
import axios from "axios";
import { cropOptions, seasonOptions, stateOptions } from "../constants/cropDetails";
import { useSearchParams } from "react-router-dom";
import { server } from "../constants/configServer";
import type { ISupportRequest } from "../constants/interfaces/user";

const SupportBoard = () => {
  const [entries, setEntries] = useState<ISupportRequest[]>([]);
  const [selectedCrop, setSelectedCrop] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 10;

  useEffect(() => {
    const current = Object.fromEntries(searchParams.entries());
    if (current.page !== "1") {
      setSearchParams({ ...current, page: "1" });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCrop, selectedState, selectedSeason]);

  useEffect(() => {
    const fetchSupport = async () => {
      try {
        const res = await axios.get<{ entries: ISupportRequest[]; totalPages: number }>(
          `${server}/support`,
          {
            params: {
              page,
              limit,
              crop: selectedCrop || undefined,
              state: selectedState || undefined,
              season: selectedSeason || undefined,
            },
          }
        );
        setEntries(res.data.entries);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("Failed to fetch support board", err);
      }
    };

    fetchSupport();
  }, [page, limit, selectedCrop, selectedState, selectedSeason]);

  return (
    <div className="min-h-screen w-full font-sans flex flex-col">
      <div className="h-[20vh] bg-yellow-600 text-white text-center items-center px-10 py-6 shadow-lg">
        <h2 className="text-4xl font-bold mb-2 mt-8">Support Board</h2>
        <p className="text-md text-yellow-100">
          Farmers asking for help based on low predicted yield.
        </p>
      </div>

      <div className="flex-1 bg-gray-50 px-6 md:px-12 py-10 overflow-auto">
        <h3 className="text-3xl font-semibold mb-8 text-center text-yellow-600">Requests for Support</h3>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="min-w-full table-auto text-sm text-gray-900 border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-yellow-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Username</th>

                <th className="px-4 py-3 text-left align-top">
                  <div className="flex flex-col">
                    <span className="font-medium">Crop</span>
                    <select value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)}
                      className="mt-1 bg-white text-black border border-gray-300 rounded-full px-3 py-1 text-sm">
                      <option value="">All</option>
                      {cropOptions.map((crop, idx) => (
                        <option key={idx} value={crop}>{crop}</option>
                      ))}
                    </select>
                  </div>
                </th>

                <th className="px-4 py-3 text-left align-top">
                  <div className="flex flex-col">
                    <span className="font-medium">Season</span>
                    <select value={selectedSeason} onChange={(e) => setSelectedSeason(e.target.value)}
                      className="mt-1 bg-white text-black border border-gray-300 rounded-full px-3 py-1 text-sm">
                      <option value="">All</option>
                      {seasonOptions.map((season, idx) => (
                        <option key={idx} value={season}>{season}</option>
                      ))}
                    </select>
                  </div>
                </th>

                <th className="px-4 py-3 text-left align-top">
                  <div className="flex flex-col">
                    <span className="font-medium">State</span>
                    <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)}
                      className="mt-1 bg-white text-black border border-gray-300 rounded-full px-3 py-1 text-sm">
                      <option value="">All</option>
                      {stateOptions.map((state, idx) => (
                        <option key={idx} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                </th>

                <th className="px-4 py-3 text-left">Yield (%)</th>
                <th className="px-4 py-3 text-left">Support Type</th>
                <th className="px-4 py-3 text-left w-[400px]">Support Description</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Contact</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {entries.length > 0 ? (
                entries.map((entry, index) => (
                  <tr key={index} className="hover:bg-yellow-50 transition">
                    <td className="px-4 py-4">{entry.username}</td>
                    <td className="px-4 py-4">{entry.crop}</td>
                    <td className="px-4 py-4">{entry.season}</td>
                    <td className="px-4 py-4">{entry.state}</td>
                    <td className="px-4 py-4 text-yellow-700 font-semibold">{entry.predictedYield.toFixed(2)}</td>
                    <td className="px-4 py-4 capitalize">{entry.supportType}</td>
                    <td className="px-4 py-4 text-sm whitespace-pre-wrap break-words max-w-[400px]">
                      {entry.supportDescription}
                    </td>
                    <td className="px-4 py-4 text-sm">{new Date(entry.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-4">
                    <a
                      href={`mailto:${entry.email}`}
                      className="inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-green-700 transition duration-300"
                      target="_blank"
                      rel="noopener noreferrer">
                      Contact
                    </a>
                  </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center px-6 py-6 text-gray-500 font-medium">No support requests found</td>
                </tr>
              )}
            </tbody>
          </table>

          {entries.length > 0 && (
            <div className="mt-6 flex justify-center gap-6">
              <button
                onClick={() => {
                  const current = Object.fromEntries(searchParams.entries());
                  setSearchParams({ ...current, page: (page - 1).toString() });
                }}
                disabled={page === 1}
                className={`w-[100px] px-5 py-2 rounded-full font-medium transition-all duration-300
                  ${page === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-yellow-600 text-white hover:bg-yellow-800"}`}>
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
                  ${page >= totalPages ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-yellow-600 text-white hover:bg-yellow-800"}`}>
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportBoard;
