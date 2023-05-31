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
import { QueryResults, VariableCategories } from "../../types";
import {
  groupByColumn,
  removePrefix,
  uniqueValues,
} from "../../utils/queryResults";
import { useMemo } from "react";
import randomColor from "randomcolor";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores/store";

type StackedBarChartProps = {
  results: QueryResults;
  variables: VariableCategories;
  width: number;
  height: number;
};

const StackedBarChart = observer(
  ({ results, width, height, variables }: StackedBarChartProps) => {
    const rootStore = useStore();
    const settings = rootStore.settingsStore;

    const tabHeight = 60;
    const { header } = results;
    const barKeyIdx = header.indexOf(variables.key[0]);
    const stackKeyIdx = header.indexOf(variables.key[1]);
    const valueIdx = header.indexOf(variables.scalar[0]);

    const data = useMemo(() => {
      const stacks = groupByColumn(results.data, stackKeyIdx);
      const data = Object.keys(stacks).map((stackLabel: string) => {
        const values = { [header[stackKeyIdx]]: removePrefix(stackLabel) };

        for (let row of stacks[stackLabel]) {
          values[row[barKeyIdx]] = row[valueIdx];
        }
        return values;
      });
      return data;
    }, [header, results.data, barKeyIdx, stackKeyIdx, valueIdx]);

    return (
      <ResponsiveContainer width="100%" height={height - tabHeight}>
        <BarRechart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={header[stackKeyIdx]} />
          <YAxis />
          <Tooltip />
          <Legend />
          {uniqueValues(results.data, barKeyIdx).map(
            (dataKey: string, index: number) => (
              <Bar
                key={`bar-${index}`}
                dataKey={dataKey}
                stackId="a"
                fill={randomColor({
                  luminosity: settings.darkMode ? "light" : "dark",
                })}
              />
            )
          )}
        </BarRechart>
      </ResponsiveContainer>
    );
  }
);

export default StackedBarChart;
