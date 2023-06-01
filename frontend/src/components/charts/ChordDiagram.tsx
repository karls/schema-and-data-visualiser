import ReactChordDiagram from "react-chord-diagram";
import { QueryResults, URI, VariableCategories } from "../../types";
import { useStore } from "../../stores/store";
import { useMemo, useState } from "react";
import randomColor from "randomcolor";
import {
  categoricalColumns,
  numericColumns,
  removePrefix,
} from "../../utils/queryResults";
import { Select, Space, Switch } from "antd";

type ChordDiagramProps = {
  results: QueryResults;
  width: number;
  height: number;
  variables: VariableCategories;
};

const ChordDiagram = ({ results, width, height, variables }: ChordDiagramProps) => {
  const rootStore = useStore();
  const settings = rootStore.settingsStore;
  const { header, data } = results;
  const col1Idx = header.indexOf(variables.key[0]);
  const col2Idx = header.indexOf(variables.key[1]);

  const valueColumn = variables.scalar[0];
  const [labels, setLabels] = useState<URI[]>([]);
  const [symmetric, setSymmetric] = useState<boolean>(true);

  const matrix: number[][] = useMemo(() => {
    const uniqueLabels = new Set<URI>();
    const links: { [key: string]: { [key: string]: number } } = {};
    for (let row of data) {
      uniqueLabels.add(row[col1Idx]);
      uniqueLabels.add(row[col2Idx]);

      if (!links[row[col1Idx]]) {
        links[row[col1Idx]] = {};
      }

      links[row[col1Idx]][row[col2Idx]] = parseFloat(row[valueColumn]);

      if (symmetric) {
        if (!links[row[col2Idx]]) {
            links[row[col2Idx]] = {};
          }
    
          links[row[col2Idx]][row[col1Idx]] = parseFloat(row[valueColumn]);
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
  }, [results, col1Idx, col2Idx, valueColumn, symmetric]);

  return (
    <Space direction="vertical" style={{ width, height }}>
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
