import Navbar from "../Components/Navbar";
import { UseAuth } from "../context/auth";
import { useHomeStats } from "../Hooks/useHomeStats";
import { useLeaderboard } from "../Hooks/useLeaderboard";
import RecentPredictionsChart from "../Components/RecentPredictionChart.tsx";
import HomeLeaderBoard from "../Components/HomeLeaderBoard";
import SupportRequests from "../Components/SupportRequest";
import BestPredictionSection from "../Components/BestPredictionSection";
import Loader from "../Components/Loader";

const Home = () => {
  const { user } = UseAuth();
  const { recentPredictions, bestPrediction, loading: statsLoading } = useHomeStats(user?.email);
  const { leaderboard, loading: leaderboardLoading } = useLeaderboard();

  if (statsLoading || leaderboardLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f9fafb] dark:bg-[#111]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full font-sans">
      <div className="bg-[#1E4023] h-[11rem] w-full relative z-10 shadow">
        <Navbar />
      </div>
      <div className="relative -mt-14 px-4 md:px-16 z-20">
      <h2 className="text-3xl font-bold text-white mb-8">
        Welcome back, <span className="text-green-400">{user?.username}</span>!
      </h2>

      <div className="flex flex-col lg:flex-row gap-6 h-[45rem]">
        <div className="flex-1 space-y-6 mb-10">
          <BestPredictionSection bestPrediction={bestPrediction} />
          <RecentPredictionsChart predictions={recentPredictions} />
        </div>
        <div className="w-full lg:w-1/3 mb-10">
          <HomeLeaderBoard leaderboard={leaderboard} />
        </div>
      </div>
      <SupportRequests />
    </div>
    </div>
  );
};

export default Home;
