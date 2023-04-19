import {
  Cell,
  Label,
  Legend,
  Pie,
  PieChart as PieRechart,
  Tooltip,
} from "recharts";
import { QueryResults } from "../../types";
import { removePrefix } from "../../utils/queryResults";
import randomColour from "randomcolor";

type PieChartProps = {
  results: QueryResults;
  width: number;
  height: number;
  columnIndex: number;
};

const PieChart = ({ results, width, height, columnIndex }: PieChartProps) => {
  const data = results.data.map((row) => {
    return {
      [results.header[0]]: removePrefix(row[0]),
      [results.header[columnIndex]]: parseInt(row[columnIndex]),
    };
  });

  const totalSum = results.data
    .map((row) => parseInt(row[columnIndex]))
    .reduce((a, b) => a + b, 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active) {
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "#ffff",
            padding: "5px",
            border: "columnIndexpx solid #cccc",
          }}
        >
          {`${payload[0].name} : ${(
            (100 * payload[0].value) /
            totalSum
          ).toFixed(2)}%`}
        </div>
      );
    }
    return null;
  };

  return (
      <PieRechart width={width} height={height}>
        <Pie
          data={data}
          nameKey={results.header[0]}
          dataKey={results.header[columnIndex]}
          cx="50%"
          cy="50%"
          // outerRadius={50}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={randomColour()} />
          ))}
        </Pie>
        <Tooltip content={CustomTooltip} />
        <Legend />
        {/* <Pie data={data02} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#82ca9d" label /> */}
      </PieRechart>
  );
};

export default PieChart;
