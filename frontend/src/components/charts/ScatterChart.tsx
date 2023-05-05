import { QueryResults } from "../../types";
import { numericColumns, removePrefix } from "../../utils/queryResults";
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
import { useMemo, useState } from "react";

type ScatterChartProps = {
  results: QueryResults;
  width?: number;
  height: number;
};

const ScatterChart = observer(
  ({ results, width, height }: ScatterChartProps) => {
    const rootStore = useStore();
    const settings = rootStore.settingsStore;
    const numIdxs = numericColumns(results);
    const [col1, setCol1] = useState(numIdxs[0]);
    const [col2, setCol2] = useState(numIdxs[1]);
    const [col3, setCol3] = useState(numIdxs[2]);

    const data = useMemo(
      () =>
        results.data.map((row) => {
          const label = `${removePrefix(row[0])}

      ${results.header[col1]}: ${row[col1]}
      ${results.header[col2]}: ${row[col2]}
      ${col3 ? `${results.header[col2]}: ${row[col2]}` : ''}`;

          return {
            label,
            x: parseFloat(row[col1]),
            y: parseFloat(row[col2]),
            z: parseFloat(row[col3] ?? 1),
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
