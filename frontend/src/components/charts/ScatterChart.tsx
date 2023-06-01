import { QueryResults, VariableCategories } from "../../types";
import { removePrefix } from "../../utils/queryResults";
import randomColor from "randomcolor";
import { useStore } from "../../stores/store";
import { observer } from "mobx-react-lite";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryScatter,
  VictoryTheme,
  VictoryTooltip,
  VictoryZoomContainer,
} from "victory";
import { useMemo } from "react";

type ScatterChartProps = {
  results: QueryResults;
  width?: number;
  height: number;
  variables: VariableCategories;
};

const ScatterChart = observer(
  ({ results, width, height, variables }: ScatterChartProps) => {
    const rootStore = useStore();
    const settings = rootStore.settingsStore;
    const [col1, col2, col3] = variables.scalar.map((column) =>
      results.header.indexOf(column)
    );
    const data = useMemo(
      () =>
        results.data.map((row) => {
          const label = `${removePrefix(row[0])}

      ${results.header[col1]}: ${parseFloat(row[col1]).toLocaleString()}
      ${results.header[col2]}: ${parseFloat(row[col2]).toLocaleString()}
      ${
        col3 !== -1
          ? `${results.header[col3]}: ${parseFloat(row[col3]).toLocaleString()}`
          : ""
      }`;

          return {
            label,
            x: parseFloat(row[col1]),
            y: parseFloat(row[col2]),
            z: col3 !== -1 ? parseFloat(row[col3]) : 1,
            fill: randomColor({
              luminosity: settings.darkMode ? "light" : "dark",
            }),
            amount: 2,
          };
        }),
      [col1, col2, col3, results.data, results.header, settings.darkMode]
    );

    return (
      <>
        <VictoryChart
          width={width}
          height={height}
          theme={VictoryTheme.material}
          padding={{ bottom: 40, left: 100, right: 10, top: 10 }}
          domainPadding={{ x: 10, y: 10 }}
          containerComponent={
            <VictoryZoomContainer
              width={width}
              height={height}
              responsive={false}
            />
          }
        >
          <VictoryAxis
            label={results.header[col1]}
            axisLabelComponent={<VictoryLabel dy={20} />}
            style={{
              tickLabels: { fontSize: 15, padding: 5 },
            }}
            fixLabelOverlap
            domainPadding={{ x: [10, -10], y: 5 }}
          />
          <VictoryAxis
            label={results.header[col2]}
            axisLabelComponent={<VictoryLabel dy={-75} />}
            style={{
              tickLabels: { fontSize: 15, padding: 5 },
            }}
            dependentAxis
            fixLabelOverlap
            domainPadding={{ x: [10, -10], y: 5 }}
          />
          <VictoryScatter
            bubbleProperty="z"
            maxBubbleSize={20}
            minBubbleSize={5}
            labelComponent={<VictoryTooltip style={{ fontSize: 15 }} />}
            style={{ data: { fill: ({ datum }) => datum.fill } }}
            data={data}
          />
        </VictoryChart>
      </>
    );
  }
);

export default ScatterChart;
