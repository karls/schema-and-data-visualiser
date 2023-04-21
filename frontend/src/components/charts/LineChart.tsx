import {
  Bar,
  LineChart as LineRechart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  ResponsiveContainer,
} from "recharts";
import { QueryResults } from "../../types";
import { removePrefix } from "../../utils/queryResults";

type LineChartProps = {
  results: QueryResults;
  width: number;
  height: number;
  columnIndex: number;
};

const LineChart = ({ results, width, height, columnIndex }: LineChartProps) => {
  const data = results.data.map((row) => {
    return {
      [results.header[0]]: removePrefix(row[0]),
      [results.header[columnIndex]]: parseInt(row[columnIndex]),
    };
  });
  return (
    <LineRechart width={width} height={height} data={data}>
      <Line
        type="monotone"
        dataKey={results.header[columnIndex]}
        stroke="#8884d8"
        dot={false}
      />
      <XAxis dataKey={results.header[0]} />
      <YAxis />
      <Tooltip />
      <Legend />
    </LineRechart>
  );
};

export default LineChart;
