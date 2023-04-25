import {
  Bar,
  BarChart as BarRechart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { QueryResults } from "../../types";
import { removePrefix } from "../../utils/queryResults";

type BarChartProps = {
  results: QueryResults;
  columnIndex: number;
  width: number;
  height: number;
};

const BarChart = ({ results, width, height, columnIndex }: BarChartProps) => {
  const data = results.data.map((row) => {
    const bar: any = { name: removePrefix(row[0]) };
    bar[results.header[columnIndex]] = row[columnIndex];
    return bar;
  });
  return (
    <BarRechart width={width} height={height} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey={results.header[columnIndex]} fill="#8884d8" />
    </BarRechart>
  );
};

export default BarChart;
