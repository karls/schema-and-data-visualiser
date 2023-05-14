import { Treemap, TreemapPoint } from "react-vis";
import "react-vis/dist/style.css";
import { QueryResults } from "../../types";
import { removePrefix } from "../../utils/queryResults";
import { useStore } from "../../stores/store";
import { useMemo, useState } from "react";
import randomColor from "randomcolor";
import { Segmented, Space, Typography } from "antd";
import { BsFillCircleFill } from "react-icons/bs";
import { MdRectangle } from "react-icons/md";

type TreeMapProps = {
  results: QueryResults;
  columnIndex: number;
  width: number;
  height: number;
};

type ModeOption = "squarify" | "circlePack";

export const TreeMap = ({
  results,
  columnIndex,
  width,
  height,
}: TreeMapProps) => {
  const rootStore = useStore();
  const settings = rootStore.settingsStore;

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
          size: parseInt(row[columnIndex]),
        };
      }),
    };
  }, [results, columnIndex, settings.darkMode]);

  return (
    <Space direction="vertical">
      <Space>
        <Typography.Text>Layout:</Typography.Text>
        <Segmented
          onChange={(value) => setMode(value as ModeOption)}
          options={[
            { icon: <MdRectangle size={20} />, value: "squarify" },
            { icon: <BsFillCircleFill size={15} />, value: "circlePack" },
          ]}
        />
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
