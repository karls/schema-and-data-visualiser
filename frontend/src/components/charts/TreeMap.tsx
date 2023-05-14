import { Treemap, TreemapPoint } from "react-vis";
import "react-vis/dist/style.css";
import { QueryResults } from "../../types";
import { numericColumns, removePrefix } from "../../utils/queryResults";
import { useStore } from "../../stores/store";
import { useMemo, useState } from "react";
import randomColor from "randomcolor";
import { Segmented, Select, Space, Typography } from "antd";
import { BsFillCircleFill } from "react-icons/bs";
import { MdRectangle } from "react-icons/md";

type TreeMapProps = {
  results: QueryResults;
  width: number;
  height: number;
};

type ModeOption = "squarify" | "circlePack";

export const TreeMap = ({ results, width, height }: TreeMapProps) => {
  const rootStore = useStore();
  const settings = rootStore.settingsStore;
  const numIdxs = numericColumns(results);
  const [columnIndex, setColumnIndex] = useState<number>(numIdxs[0]);
  const [mode, setMode] = useState<ModeOption>("squarify");
  const [hoveredNode, setHoveredNode] = useState<TreemapPoint | null>();

  const data = useMemo(() => {
    return {
      title: results.header[columnIndex],
      color: "transparent",
      children: results.data.map((row) => {
        return {
          title: removePrefix(row[0]),
          color: randomColor({
            luminosity: settings.darkMode ? "light" : "dark",
          }),
          size: parseFloat(row[columnIndex]),
        };
      }),
    };
  }, [results, columnIndex, settings.darkMode]);

  return (
    <Space direction="vertical">
      <Space>
        <Space>
          <Typography.Text>Value column: </Typography.Text>
          <Select
            value={columnIndex}
            style={{ width: 120 }}
            onChange={setColumnIndex}
            options={numIdxs.map((i) => {
              return {
                label: results.header[i],
                value: i,
              };
            })}
          />
        </Space>
        <Space>
          <Typography.Text>Layout:</Typography.Text>
          <Segmented
            onChange={(value) => setMode(value as ModeOption)}
            options={[
              { icon: <MdRectangle size={20} />, value: "squarify" },
              { icon: <BsFillCircleFill size={15} />, value: "circlePack" },
            ]}
          />
        </Space>
        {hoveredNode && (
          <Typography.Text>
            {hoveredNode.data.title}: {hoveredNode.data.size}
          </Typography.Text>
        )}
      </Space>
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
};

export default TreeMap;
