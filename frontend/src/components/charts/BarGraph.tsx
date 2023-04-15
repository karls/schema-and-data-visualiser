import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { QueryResults } from "../../types";
import { removePrefix } from "../../utils/queryResults";

type BarGraphProps = {
  results: QueryResults;
  width: number;
  height: number;
};

const BarGraph = ({ results, width, height }: BarGraphProps) => {
  const data = results.data.map((row) => {
    const bar: any = { name: removePrefix(row[0]) };
    for (let i = 1; i < row.length; i++) {
      bar[results.header[i]] = row[i];
    }
    return bar;
  });
  return (
    <BarChart width={width} height={height} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      {results.header.map(
        (column, index) => index > 0 && <Bar dataKey={column} fill="#8884d8" />
      )}
    </BarChart>
  );
};

export default BarGraph;
