import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { DemographicChartDataType } from "../../data/types";

interface OknDemographicChartProps {
  data: DemographicChartDataType[];
}

const OknDemographicChart = ({ data }: OknDemographicChartProps) => {
  return (
    <div className="w-1/3 p-8">
      <ResponsiveContainer width="100%" height="100%" aspect={4 / 2}>
        <BarChart width={700} height={350} data={data} barSize={20}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="feature" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="counts" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OknDemographicChart;
