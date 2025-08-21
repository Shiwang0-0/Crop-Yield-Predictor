import BestPredictionCard from "../Components/BestPredictionCard";
import { Link } from "react-router-dom";
import type { IUserCrop } from "../constants/interfaces/user";

interface Props {
  bestPrediction: IUserCrop | null;
}

const BestPredictionSection = ({ bestPrediction }: Props) => {
  if (!bestPrediction) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 mb-10 h-full">
        <h3 className="text-2xl font-semibold text-green-700">
          Make your first prediction
        </h3>
         <div className="flex items-center justify-center h-[80%]">
          <div className="w-full bg-gradient-to-r from-green-50 to-green-100 rounded-xl shadow hover:shadow-lg transition flex flex-col items-center justify-center text-center h-full mt-[5rem]">
            <p className="text-gray-600">
              Start predicting crop yields and track your progress on the leaderboard.
            </p>
            <div className="flex space-x-4">
              <Link
                to="/predict"
                className="px-6 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition"
              >
                Predict Now
              </Link>
              <Link
                to="/leaderboard"
                className="px-6 py-3 rounded-xl bg-gray-100 text-gray-800 font-medium hover:bg-gray-200 transition"
              >
                See Leaderboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <BestPredictionCard bestPrediction={bestPrediction} />;
};

export default BestPredictionSection;
