import { QueryResults } from "../../types";
import { numericColumns, removePrefix } from "../../utils/queryResults";
import randomColor from "randomcolor";
import { useStore } from "../../stores/store";
import { observer } from "mobx-react-lite";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryTheme,
  VictoryTooltip,
  createContainer,
} from "victory";
import { useMemo, useState } from "react";
import { Select, Space } from "antd";

type LineChartProps = {
  results: QueryResults;
  width: number;
  height: number;
};

const LineChart = observer(({ results, width, height }: LineChartProps) => {
  const rootStore = useStore();
  const settings = rootStore.settingsStore;
  const numIdxs = numericColumns(results);
  const [col1, setCol1] = useState(numIdxs[0]);
  const [col2, setCol2] = useState(numIdxs[1]);

  const data = useMemo(
    () =>
      results.data.map((row) => {
        const label = `${removePrefix(row[0])}

      ${results.header[col1]}: ${row[col1]}
      ${results.header[col2]}: ${row[col2]}`;

        return {
          label,
          x: parseFloat(row[col1]),
          y: parseFloat(row[col2]),
          fill: randomColor({
            luminosity: settings.darkMode ? "light" : "dark",
          }),
        };
      }),
    [col1, col2, results.data, results.header, settings.darkMode]
  );

  const VictoryZoomVoronoiContainer: any = createContainer("zoom", "voronoi");

  return (
    <div>
      <Space>
        <Select
          value={col1}
          style={{ width: 120 }}
          onChange={setCol1}
          options={numIdxs.map((i) => {
            return {
              label: results.header[i],
              value: i,
            };
          })}
        />
        <Select
          value={col2}
          style={{ width: 120 }}
          onChange={setCol2}
          options={numIdxs.map((i) => {
            return {
              label: results.header[i],
              value: i,
            };
          })}
        />
      </Space>
      <VictoryChart
        width={width}
        height={height}
        theme={VictoryTheme.material}
        padding={{ bottom: 40, left: 100, right: 10, top: 10 }}
        domainPadding={{ x: 10, y: 10 }}
        containerComponent={
          <VictoryZoomVoronoiContainer
            width={width}
            height={height}
            responsive={false}
            labels={({ datum }: any) => datum.label}
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
          // axisLabelComponent={<VictoryLabel dy={-75} />}
          style={{
            tickLabels: { fontSize: 15, padding: 5 },
          }}
          dependentAxis
          fixLabelOverlap
          domainPadding={{ x: [10, -10], y: 5 }}
        />
        <VictoryLine
          labelComponent={<VictoryTooltip style={{ fontSize: 15 }} />}
          // style={{ data: { fill: ({ datum }) => datum.fill } }}
          data={data}
        />
      </VictoryChart>
    </div>
  );
});

export default LineChart;
