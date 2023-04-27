import { Cell, Legend, Pie, PieChart as PieRechart, Tooltip } from "recharts";
import { QueryResults } from "../../types";
import { removePrefix } from "../../utils/queryResults";
import { useStore } from "../../stores/store";
import randomColor from "randomcolor";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";

type PieChartProps = {
  results: QueryResults;
  width: number;
  height: number;
  columnIndex: number;
};

const PieChart = observer(
  ({ results, width, height, columnIndex }: PieChartProps) => {
    const rootStore = useStore();
    const settings = rootStore.settingsStore;

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

    const totalSum = useMemo(
      () =>
        results.data
          .map((row) => parseInt(row[columnIndex]))
          .reduce((a, b) => a + b, 0),
      [results, columnIndex]
    );

    const CustomTooltip = ({ active, payload, label }: any) => {
      if (active) {
        return (
          <div
            className="custom-tooltip"
            style={{
              backgroundColor: settings.darkMode ? "black" : "#ffff",
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
          {data.map((entry, index: number) => (
            <Cell
              key={`cell-${index}`}
              fill={randomColor({
                luminosity: settings.darkMode ? "light" : "dark",
              })}
            />
          ))}
        </Pie>
        <Tooltip content={CustomTooltip} />
        <Legend />
      </PieRechart>
    );
  }
);

export default PieChart;
