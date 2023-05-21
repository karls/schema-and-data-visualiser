import { useMemo, useState } from "react";
import { Treemap, TreemapPoint } from "react-vis";
import "react-vis/dist/style.css";
import { QueryResults, VariableCategories } from "../../types";
import { useStore } from "../../stores/store";
import randomColor from "randomcolor";
import { Space, Statistic } from "antd";
import { observer } from "mobx-react-lite";

type ModeOption = "squarify" | "circlePack";

type TreeMapProps = {
  results: QueryResults;
  width: number;
  height: number;
  mode?: ModeOption;
  variables: VariableCategories;
};

export const TreeMap = observer(
  ({ results, width, height, mode = "squarify", variables }: TreeMapProps) => {
    const rootStore = useStore();
    const settings = rootStore.settingsStore;
    const [hoveredNode, setHoveredNode] = useState<TreemapPoint | null>();

    const data = useMemo(() => {
      return getData(
        results,
        variables.key,
        variables.scalar[0],
        settings.darkMode ? "light" : "dark",
        mode === "circlePack"
      );
    }, [mode, results, settings.darkMode, variables.key, variables.scalar]);

    return (
      <Space direction="vertical">
        <Statistic
          title={hoveredNode ? hoveredNode.data.title : "Title"}
          value={hoveredNode ? hoveredNode.data.size : "Size"}
        />

        <Treemap
          data={data}
          animation={{
            damping: 9,
            stiffness: 300,
          }}
          onLeafMouseOver={(x) => setHoveredNode(x)}
          onLeafMouseOut={() => setHoveredNode(null)}
          width={width}
          height={height}
          mode={mode}
          colorType="literal"
          getLabel={(x) => x.title}
        />
      </Space>
    );
  }
);

function getData(
  results: QueryResults,
  titleColumns: string[],
  sizeColumn: string,
  colourMode: "light" | "dark",
  addSize: boolean
): any {
  const sizeIndex = results.header.indexOf(sizeColumn);

  let dataFromTitle: any = {};
  for (let row of results.data) {
    const title = titleColumns.at(-1)!;
    const titleIndex = results.header.indexOf(title);
    // Leaf node contains title and size but no children
    dataFromTitle[row[titleIndex]] = {
      title: row[titleIndex],
      size: parseFloat(row[sizeIndex]),
      color: randomColor(),
    };
  }
  for (let i = titleColumns.length - 1; i > 0; i--) {
    const parentTitle = titleColumns[i - 1];
    const parentTitleIndex = results.header.indexOf(parentTitle);

    const childTitle = titleColumns[i];
    const childTitleIndex = results.header.indexOf(childTitle);

    const newDataFromTitle = {}; // Data with previous column as key

    for (let row of results.data) {
      const parentValue = row[parentTitleIndex];
      const childValue = row[childTitleIndex];

      newDataFromTitle[parentValue] = newDataFromTitle[parentValue] || {
        title: parentValue,
        children: [],
        color: randomColor({ luminosity: colourMode }),
        size: 0,
      };

      const parentData = newDataFromTitle[parentValue];
      const childData = dataFromTitle[childValue];

      if (parentData.children.length > 0) {
        childData.color = parentData.children[0].color;
      }

      parentData.children.push(childData);
      if (addSize) {
        parentData.size += childData.size; // Increment parent's size using child for circle packing
      }
    }

    dataFromTitle = newDataFromTitle;
  }
  const children = Object.values(dataFromTitle);
  const data = {
    title: titleColumns.join(" <- ") + " <- " + sizeColumn, // Text to show hierarchy of columns
    children,
    color: randomColor(),
    size: children.map((child: any) => child.size).reduce((a, b) => a + b, 0),
  };

  return data;
}

export default TreeMap;
