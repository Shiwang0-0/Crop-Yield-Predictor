import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { IRecentPrediction } from "../constants/interfaces/user";
import type { TooltipProps } from "../constants/interfaces/charts";

export default function RecentPredictionsChart({
  predictions,
}: {
  predictions: IRecentPrediction[];
}) {
  if (!predictions.length) return null;

  // Simplified: only keep date/hour label, allow stacking at same label
  const formattedData = predictions.map((p,idx) => {
    const date = new Date(p.createdAt);
    const hourLabel = date.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return {
      ...p,
      createdAtLabel: `${hourLabel} entry-${idx+1}`
    };
  });

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<IRecentPrediction>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/90 p-2 rounded shadow-md text-sm">
          <p>
            <strong>Date:</strong> {label}
          </p>
          <p>
            <strong>Crop:</strong> {data.crop}
          </p>
          <p>
            <strong>Yield:</strong> {data.predictedYield.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-10">
      <h3 className="text-2xl font-semibold text-green-700 mb-6">
        Recent Yield Predictions
      </h3>
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-5 shadow hover:shadow-lg transition">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={formattedData}
            margin={{ top: 20, right: 30, left: 5, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="createdAtLabel" angle={-35} textAnchor="end" height={60} tickFormatter={(label) => label.split(",")[0]} dy={4}
            />
            <YAxis
              domain={[0, "dataMax + 5"]}
              tickFormatter={(value) =>
                (Math.floor(value * 100) / 100).toFixed(2)
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="predictedYield" stroke="#22c55e" strokeWidth={3} activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
