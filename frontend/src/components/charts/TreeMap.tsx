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

    const { data, titleSizes } = useMemo(() => {
      return getHierarchicalData(
        results,
        variables.key,
        variables.scalar[0],
        settings.darkMode ? "light" : "dark",
        true
      );
    }, [results, settings.darkMode, variables.key, variables.scalar]);

    return (
      <Space direction="vertical">
        <Statistic
          title={hoveredNode ? hoveredNode.data.title : "Title"}
          value={hoveredNode ? titleSizes[hoveredNode.data.title] : "Size"}
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

function getHierarchicalData(
  results: QueryResults,
  keyColumns: string[],
  sizeColumn: string,
  colourMode: "light" | "dark",
  addSize: boolean
): any {
  const sizeIndex = results.header.indexOf(sizeColumn);
  const titleSizes = {};
  let dataFromTitle: any = {};

  for (let row of results.data) {
    const column = keyColumns.at(-1)!;
    const titleIndex = results.header.indexOf(column);
    const title = row[titleIndex];
    const size = parseFloat(row[sizeIndex]);
    // Leaf node contains title and size but no children
    dataFromTitle[row[titleIndex]] = {
      title,
      size,
      color: randomColor(),
      value: size,
    };
    titleSizes[title] = size;
  }

  for (let i = keyColumns.length - 1; i > 0; i--) {
    const parentTitle = keyColumns[i - 1];
    const parentTitleIndex = results.header.indexOf(parentTitle);

    const childTitle = keyColumns[i];
    const childTitleIndex = results.header.indexOf(childTitle);

    const newDataFromTitle = {}; // Data with previous column as key
    const parentChildren = {};
    for (let row of results.data) {
      const parentValue = row[parentTitleIndex];
      const childValue = row[childTitleIndex];
      parentChildren[parentValue] = parentChildren[parentValue] ?? new Set();
      parentChildren[parentValue].add(childValue);
    }

    for (let parentValue of Object.keys(parentChildren)) {
      newDataFromTitle[parentValue] = newDataFromTitle[parentValue] ?? {
        title: parentValue,
        children: [],
        color: randomColor({ luminosity: colourMode }),
        size: 0,
        value: 0,
      };
      const parentData = newDataFromTitle[parentValue];

      for (let childValue of parentChildren[parentValue]) {
        const childData = dataFromTitle[childValue];

        if (parentData.children.length > 0) {
          childData.color = parentData.children[0].color;
        }

        parentData.children.push(childData);
        parentData.value += childData.value; // Increment parent's size using child for circle packing
      }
      titleSizes[parentValue] = parentData.value;
      // parentData.size = 0;
    }

    dataFromTitle = newDataFromTitle;
  }
  const children = Object.values(dataFromTitle);
  const label = keyColumns.join(" <- ") + " <- " + sizeColumn;
  const totalSize = children
    .map((child: any) => child.value)
    .reduce((a, b) => a + b, 0);
    
  titleSizes[label] = totalSize;

  const data = {
    title: label, // Text to show hierarchy of columns
    children,
    color: randomColor(),
  };
  // console.log(data);
  return { data, titleSizes };
}

export default TreeMap;
