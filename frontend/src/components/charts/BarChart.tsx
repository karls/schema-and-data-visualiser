import {
  Bar,
  BarChart as BarRechart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { QueryResults } from "../../types";
import { removePrefix } from "../../utils/queryResults";
import { useMemo } from "react";

type BarChartProps = {
  results: QueryResults;
  columnIndex: number;
  width: number;
  height: number;
};

const BarChart = ({ results, width, height, columnIndex }: BarChartProps) => {
  const data = useMemo(
    () =>
      results.data.map((row) => {
        const bar: any = { name: removePrefix(row[0]) };
        bar[results.header[columnIndex]] = row[columnIndex];
        return bar;
      }),
    [results, columnIndex]
  );

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarRechart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={results.header[columnIndex]} fill="#8884d8" />
      </BarRechart>
    </ResponsiveContainer>
  );
};

export default BarChart;
