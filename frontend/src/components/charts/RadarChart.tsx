import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart as RadarRechart,
  Tooltip,
} from "recharts";
import { QueryResults } from "../../types";
import { removePrefix } from "../../utils/queryResults";
import randomColor from "randomcolor";

type RadarChartProps = {
  results: QueryResults;
  width: number;
  height: number;
  featureIndices: number[];
};

const RadarChart = ({
  results,
  width,
  height,
  featureIndices,
}: RadarChartProps) => {
  const data = featureIndices.map((i) => {
    const values: any = { name: results.header[i] };
    results.data.forEach((row) => {
      values[removePrefix(row[0])] = row[i];
    });
    return values;
  });
  return (
    <RadarRechart
      cx="50%"
      cy="50%"
      outerRadius="80%"
      width={width}
      height={height}
      data={data}
    >
      <PolarGrid />
      <PolarAngleAxis dataKey="subject" />
      <PolarRadiusAxis angle={30} domain={[0, 150]} />
      {results.data.map((row) => {
        const colour = randomColor();
        return (
          <Radar
            name={removePrefix(row[0])}
            dataKey={removePrefix(row[0])}
            stroke={colour}
            fill={colour}
            fillOpacity={0.6}
          />
        );
      })}
      <Tooltip />
      <Legend />
    </RadarRechart>
  );
};

export default RadarChart;
