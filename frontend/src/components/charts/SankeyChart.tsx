import { Chart } from "react-google-charts";
import { QueryResults, URI } from "../../types";
import { numericColumns, removePrefix } from "../../utils/queryResults";
import { useMemo, useState } from "react";
import { Alert, Select, Space } from "antd";
import { categoricalColumns } from "../../utils/queryResults";

type SankeyChartProps = {
  results: QueryResults;
  width: number;
  height: number;
};

function getLinks(
  results: QueryResults,
  col1: number = 0,
  col2: number = 1,
  valueCol: number = 2
) {
  const links: [URI, URI, number][] = [];
  for (let row of results.data) {
    links.push([
      removePrefix(row[col1]),
      removePrefix(row[col2]),
      parseFloat(row[valueCol]),
    ]);
  }

  return [["From", "To", results.header[2]], ...links];
}

const SankeyChart = ({ results, width, height }: SankeyChartProps) => {
  const categIdxs = categoricalColumns(results);
  const [col1, setCol1] = useState(categIdxs[0]);
  const [col2, setCol2] = useState(categIdxs[1]);

  const numIdxs = numericColumns(results);
  const [valueColumn, setValueColumn] = useState<number>(numIdxs[0]);

  const data = useMemo(() => {
    return getLinks(results, col1, col2, valueColumn);
  }, [results, col1, col2,  valueColumn]);

  const options = {
    width,
    height,
    sankey: {
      node: {
        label: {
          fontName: "Times-Roman",
          fontSize: 14,
          // color: "#871b47",
          bold: true,
          italic: true,
        },
      },
    },
  };
  return (
    <Space direction="vertical">
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
      </Space>
      {col1 !== col2 && <Chart chartType="Sankey" data={data} options={options} />}
      {col1 === col2 && <Alert banner message="Both of the columns can't be the same" />}
    </Space>
  );
};

export default SankeyChart;
