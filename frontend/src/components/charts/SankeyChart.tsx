import { Chart } from "react-google-charts";
import { QueryResults } from "../../types";
import { removePrefix } from "../../utils/queryResults";
import { useMemo } from "react";

type SankeyChartProps = {
  results: QueryResults;
  width: number;
  height: number;
};

function getLinks(results: QueryResults) {
  const links = [];
  for (let row of results.data) {
    links.push([removePrefix(row[0]), removePrefix(row[1]), parseInt(row[2])]);
  }

  return [["From", "To", results.header[2]], ...links];
}

const SankeyChart = ({ results, width, height }: SankeyChartProps) => {
  const data = useMemo(() => getLinks(results), [results]);

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
    <Chart chartType="Sankey" data={data} options={options} />
  );
};

export default SankeyChart;
