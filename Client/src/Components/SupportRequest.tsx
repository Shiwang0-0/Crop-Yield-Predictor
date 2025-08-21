import { useSupportRequests } from "../Hooks/useSupportRequests";
import { typeColors } from "../constants/interfaces/user";

export default function SupportRequests() {
  const { loading, supportRequests } = useSupportRequests();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!supportRequests.length) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 mb-10">
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-5 shadow hover:shadow-lg transition text-center text-gray-600">
          <h3 className="text-2xl font-semibold text-green-700 mb-4">
            Your Support Requests
          </h3>
          <p>No support requests found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-10">
      <h3 className="text-2xl font-semibold text-green-700 mb-6">
        Your Support Requests
      </h3>
      <div
        className={`
          grid gap-6 
          ${supportRequests.length === 1 ? "grid-cols-1" : ""}
          ${supportRequests.length === 2 ? "grid-cols-1 sm:grid-cols-2" : ""}
          ${supportRequests.length === 3 ? "grid-cols-1 sm:grid-cols-3" : ""}
        `}
      >
        {supportRequests.map((req) => (
          <div
            key={req._id}
            className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-5 shadow hover:shadow-lg transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-bold text-gray-800">
                  {req.crop} ({req.crop_year})
                </h4>
                <p className="text-sm text-gray-600">
                  {req.season} • {req.state}
                </p>
              </div>
              <span className={`px-3 py-1 text-xs rounded-full font-medium ${ typeColors[req.supportType]}`}>
                {req.supportType}
              </span>
            </div>

            {req.supportDescription && (
              <p className="mt-3 text-gray-700 text-sm">
                {req.supportDescription}
              </p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 text-sm text-gray-700">
              <p>
                <span className="font-semibold">Area:</span> {req.area}
              </p>
              <p>
                <span className="font-semibold">Rainfall:</span> {req.rainfall}
              </p>
              <p>
                <span className="font-semibold">Fertilizer:</span>{" "}
                {req.fertilizer}
              </p>
              <p>
                <span className="font-semibold">Pesticide:</span>{" "}
                {req.pesticide}
              </p>
              <p>
                <span className="font-semibold">Predicted Yield:</span>{" "}
                {req.predictedYield.toFixed(2)}
              </p>
              <p className="text-gray-500 text-xs col-span-2 sm:col-span-3">
                Created: {new Date(req.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
