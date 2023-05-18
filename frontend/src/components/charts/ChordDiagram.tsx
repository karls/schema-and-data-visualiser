import ReactChordDiagram from "react-chord-diagram";
import { QueryResults, URI } from "../../types";
import { useStore } from "../../stores/store";
import { useMemo, useState } from "react";
import randomColor from "randomcolor";
import {
  categoricalColumns,
  numericColumns,
  removePrefix,
} from "../../utils/queryResults";
import { Select, Space, Switch } from "antd";

type ChordDiagProps = {
  results: QueryResults;
  width: number;
  height: number;
};

const ChordDiagram = ({ results, width, height }: ChordDiagProps) => {
  const rootStore = useStore();
  const settings = rootStore.settingsStore;

  const categIdxs = categoricalColumns(results);
  const [col1, setCol1] = useState(categIdxs[0]);
  const [col2, setCol2] = useState(categIdxs[1]);

  const numIdxs = numericColumns(results);
  const [valueColumn, setValueColumn] = useState<number>(numIdxs[0]);
  const [labels, setLabels] = useState<URI[]>([]);
  const [symmetric, setSymmetric] = useState<boolean>(true);

  const matrix: number[][] = useMemo(() => {
    const uniqueLabels = new Set<URI>();
    const links: { [key: string]: { [key: string]: number } } = {};
    for (let row of results.data) {
      uniqueLabels.add(row[col1]);
      uniqueLabels.add(row[col2]);

      if (!links[row[col1]]) {
        links[row[col1]] = {};
      }

      links[row[col1]][row[col2]] = parseFloat(row[valueColumn]);

      if (symmetric) {
        if (!links[row[col2]]) {
            links[row[col2]] = {};
          }
    
          links[row[col2]][row[col1]] = parseFloat(row[valueColumn]);
      }
    }
    const allLabels = Array.from(uniqueLabels);

    setLabels(allLabels);

    const m = allLabels.map((label1) =>
      allLabels.map((label2) =>
        links[label1] ? links[label1][label2] ?? 0 : 0
      )
    );
    return m;
  }, [results, col1, col2, valueColumn, symmetric]);

  return (
    <Space direction="vertical" style={{ width, height }}>
      <Space>
        <Select
          value={col1}
          style={{ width: 120 }}
          onChange={setCol1}
          options={categIdxs.map((i) => {
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
          options={categIdxs.map((i) => {
            return {
              label: results.header[i],
              value: i,
            };
          })}
        />
        <Select
          value={valueColumn}
          style={{ width: 120 }}
          onChange={setValueColumn}
          options={numIdxs.map((i) => {
            return {
              label: results.header[i],
              value: i,
            };
          })}
        />
        <Space>
          <Switch
            checked={symmetric}
            onChange={(checked: boolean) => setSymmetric(checked)}
          />
          Symmetric
        </Space>
      </Space>
      <ReactChordDiagram
        matrix={matrix}
        componentId={1}
        groupLabels={labels.map((t: URI) => removePrefix(t))}
        groupColors={labels.map(() =>
          randomColor({ luminosity: settings.darkMode ? "light" : "dark" })
        )}
        labelColors={labels.map(() => (settings.darkMode ? "white" : "black"))}
        style={{ margin: "auto", padding: 50, font: "white" }}
        width={width}
        outerRadius={Math.min(width, height) * 0.3}
        height={height}
        persistHoverOnClick
      />
    </Space>
  );
};

export default ChordDiagram;
