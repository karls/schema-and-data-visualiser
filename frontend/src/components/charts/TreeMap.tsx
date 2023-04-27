import { Tooltip, Treemap } from "recharts";
import { QueryResults } from "../../types";
import { removePrefix } from "../../utils/queryResults";
import { useStore } from "../../stores/store";
import { useMemo } from "react";

type TreeMapProps = {
  results: QueryResults;
  columnIndex: number;
  width: number;
  height: number;
};

export const TreeMap = ({
  results,
  columnIndex,
  width,
  height,
}: TreeMapProps) => {
  const rootStore = useStore();
  const settings = rootStore.settingsStore;

  const data = useMemo(
    () => [
      {
        name: results.header[columnIndex],
        children: results.data.map((row) => {
          return {
            name: removePrefix(row[0]),
            value: parseInt(row[columnIndex]),
          };
        }),
      },
    ],
    [results, columnIndex]
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: settings.darkMode ? "black" : "#ffff",
            padding: "5px",
            border: "columnIndexpx solid #cccc",
          }}
        >
          {`${payload[0].payload.name} : ${payload[0].value}`}
        </div>
      );
    }

    return null;
  };

  return (
    <Treemap
      width={width}
      height={height}
      data={data}
      dataKey="value"
      aspectRatio={4 / 3}
      stroke="#fff"
      fill="#8884d8"
    >
      <Tooltip content={CustomTooltip} />
    </Treemap>
  );
};

export default TreeMap;
