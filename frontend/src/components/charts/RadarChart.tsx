import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { QueryResults } from "../../types";
import { numericColumns, removePrefix } from "../../utils/queryResults";
import randomColor from "randomcolor";
import { useStore } from "../../stores/store";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";

type RadarChartProps = {
  results: QueryResults;
  width: number;
  height: number;
};

const SpiderChart = observer(
  ({ results, width, height }: RadarChartProps) => {
    const rootStore = useStore();
    const settings = rootStore.settingsStore;

    const data = useMemo(
      () =>
        numericColumns(results).map((i) => {
          const values: any = { name: results.header[i] };
          results.data.forEach((row) => {
            values[removePrefix(row[0])] = row[i];
          });
          return values;
        }),
      [results]
    );

    return (
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart
          cx="50%"
          cy="50%"
          outerRadius="80%"
          height={height}
          data={data}
        >
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 150]} />
          {results.data.map((row, index) => {
            const colour = randomColor({
              luminosity: settings.darkMode ? "light" : "dark",
            });
            return (
              <Radar
                key={`radar-${index}`}
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
        </RadarChart>
      </ResponsiveContainer>
    );
  }
);

export default SpiderChart;
