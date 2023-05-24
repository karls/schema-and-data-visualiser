import { observer } from "mobx-react-lite";
import { HeatMapGrid } from "react-grid-heatmap";
import { QueryResults, VariableCategories } from "../../types";
import { useMemo } from "react";
import { useStore } from "../../stores/store";

type HeatMapProps = {
  results: QueryResults;
  width: number;
  height: number;
  variables: VariableCategories;
};

export const HeatMap = observer(
  ({ results, width, height, variables }: HeatMapProps) => {
    const rootStore = useStore();
    const settings = rootStore.settingsStore;

    const { xLabels, yLabels, data } = useMemo(() => {
      const key1Idx = results.header.indexOf(variables.key[0]);
      const key2Idx = results.header.indexOf(variables.key[1]);
      const scalarIdx = results.header.indexOf(variables.scalar[0]);
      const sizes = {};
      const key1Values = new Set<string>();
      const key2Values = new Set<string>();

      for (let row of results.data) {
        const key1 = row[key1Idx];
        const key2 = row[key2Idx];
        key1Values.add(key1);
        key2Values.add(key2);
        sizes[key1] = sizes[key1] ?? {};
        sizes[key1][key2] = row[scalarIdx];
        sizes[key2] = sizes[key2] ?? {};
        sizes[key2][key1] = row[scalarIdx];
      }
      const xLabels: string[] = Array.from(key1Values);
      const yLabels: string[] = Array.from(key2Values);

      const data: number[][] = [];

      for (let y of yLabels) {
        const row: number[] = [];
        for (let x of xLabels) {
          row.push(parseFloat(sizes[x][y] ?? 0));
        }
        data.push(row);
      }

      return { xLabels, yLabels, data };
    }, [results.data, results.header, variables.key, variables.scalar]);

    return (
      <div
        style={{
          width: "100%",
          height,
          fontFamily: "sans-serif",
          overflow: "scroll",
        }}
      >
        <HeatMapGrid
          data={data}
          xLabels={xLabels}
          yLabels={yLabels}
          // Reder cell with tooltip
          cellRender={(y, x, value) => (
            <div title={`${xLabels[x]}, ${yLabels[y]}`}>{value === 0 ? '•' : value}</div>
          )}
          xLabelsStyle={(index) => ({
            // color: "#777",
            fontSize: ".65rem",
            marginLeft: 5,
            marginRight: 5,
            color: settings.darkMode ? "white" : "black",
          })}
          yLabelsStyle={() => ({
            fontSize: ".65rem",
            textTransform: "uppercase",
            // color: "#777",
            lineHeight: "0.6rem",
            height: 30,
            margin: "auto",
            textAlign: "center",
            padding: 10,
            position: "sticky",
            color: settings.darkMode ? "white" : "black",
          })}
          cellStyle={(_x, _y, ratio) => ({
            background: `rgb(12, 160, 44, ${ratio})`,
            fontSize: ".7rem",
            // fontColor: settings.darkMode ? "white" : "black",
            color: settings.darkMode
              ? `rgb(255, 255, 255)` // , ${ratio / 2 + 0.4})`
              : `rgb(0, 0, 0, ${ratio / 2 + 0.4})`,
            cursor: "pointer",
            height: 30,
          })}
          cellHeight="2rem"
          xLabelsPos="top"
          //   onClick={(x, y) => alert(`Clicked (${x}, ${y})`)}
          // yLabelsPos="right"
          // square
        />
      </div>
    );
  }
);

export default HeatMap;
