import {
  ScatterChart as ScatterRechart,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
  Scatter,
  CartesianGrid,
  ZAxis,
  Cell,
  LabelList,
  Label,
  ResponsiveContainer,
} from "recharts";
import { QueryResults } from "../../types";
import { removePrefix } from "../../utils/queryResults";
import randomColor from "randomcolor";
import { useStore } from "../../stores/store";
import { observer } from "mobx-react-lite";

type ScatterChartProps = {
  results: QueryResults;
  width?: number;
  height: number;
};

const ScatterChart = observer(
  ({ results, width, height }: ScatterChartProps) => {
    const rootStore = useStore();
    const settings = rootStore.settingsStore;

    const data = results.data.map((row) => {
      return {
        name: removePrefix(row[0]),
        ...(results.header[1] ? { x: parseInt(row[1]) } : {}),
        ...(results.header[2] ? { y: parseInt(row[2]) } : {}),
        ...(results.header[3] ? { z: parseInt(row[3]) } : {}),
      };
    });

    return (
      <ResponsiveContainer width={width || "100%"} height={height}>
        <ScatterRechart margin={{ top: 35, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid />
          {results.header[1] && (
            <XAxis type="number" dataKey="x" name={results.header[1]}>
              <Label value={results.header[1]} position="bottom" />
            </XAxis>
          )}
          {results.header[2] && (
            <YAxis type="number" dataKey="y" name={results.header[2]}>
              <Label value={results.header[2]} angle={-90} position="left" />
            </YAxis>
          )}
          {results.header[3] && (
            <ZAxis type="number" dataKey="z" name={results.header[3]} />
          )}
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Legend wrapperStyle={{ position: "relative" }} />
          <Scatter name={results.header[0]} data={data} fill="#8884d8">
            <LabelList dataKey="name" position="right" />
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={randomColor({
                  luminosity: settings.darkMode ? "light" : "dark",
                })}
              />
            ))}
          </Scatter>
        </ScatterRechart>
      </ResponsiveContainer>
    );
  }
);

export default ScatterChart;
