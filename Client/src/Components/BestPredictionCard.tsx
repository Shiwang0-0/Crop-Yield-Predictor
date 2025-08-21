import type { HomeStats } from "../constants/interfaces/user";

export default function BestPredictionCard({ bestPrediction }: { bestPrediction: HomeStats["bestPrediction"] }) {
  if (!bestPrediction) {
    return (
      <div className="p-4 text-center text-gray-500">
        No predictions available yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-10">
      <h2 className="text-3xl font-bold text-green-700 mb-8">
        Your Best Prediction
      </h2>
      <div className="p-6 flex justify-evenly items-center bg-gradient-to-r from-green-50 to-green-100 rounded-xl shadow hover:shadow-lg transition">
        <h2 className="text-xl font-semibold">{bestPrediction.crop}</h2>
        <p>Year: {bestPrediction.crop_year}</p>
        <p>Season: {bestPrediction.season}</p>
        <p>State: {bestPrediction.state}</p>
        <p>Predicted Yield: {(bestPrediction.predictedYield).toFixed(2)} %</p>
      </div>
    </div>
  );
}
