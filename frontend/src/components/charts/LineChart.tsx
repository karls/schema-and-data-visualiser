import {
  LineChart as LineRechart,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
  Line,
} from "recharts";
import { QueryResults } from "../../types";
import { removePrefix } from "../../utils/queryResults";
import { useMemo } from "react";

type LineChartProps = {
  results: QueryResults;
  width: number;
  height: number;
  columnIndex: number;
};

const LineChart = ({ results, width, height, columnIndex }: LineChartProps) => {
  const data = useMemo(
    () =>
      results.data.map((row) => {
        return {
          [results.header[0]]: removePrefix(row[0]),
          [results.header[columnIndex]]: parseInt(row[columnIndex]),
        };
      }),
    [results, columnIndex]
  );
  
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
