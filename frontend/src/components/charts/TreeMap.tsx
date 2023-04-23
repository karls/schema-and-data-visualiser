import { Tooltip, Treemap } from "recharts";
import { QueryResults } from "../../types";
import { removePrefix } from "../../utils/queryResults";

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
  const data = [
    {
      name: results.header[columnIndex],
      children: results.data.map((row) => {
        return { name: removePrefix(row[0]), value: parseInt(row[columnIndex]) };
      }),
    },
  ];

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
      <Tooltip />
    </Treemap>
  );
};

export default TreeMap;
