import { useMemo } from "react";
import { Chart } from "react-google-charts";
import { QueryResults, URI, VariableCategories } from "../../types";
import { removePrefix } from "../../utils/queryResults";

function getLinks(
  results: QueryResults,
  colA: string,
  colB: string,
  valueCol: string
) {
  const colAIndex = results.header.indexOf(colA);
  const colBIndex = results.header.indexOf(colB);
  const valueColIndex = results.header.indexOf(valueCol);

  const links: [URI, URI, number][] = [];
  for (let row of results.data) {
    links.push([
      removePrefix(row[colAIndex]),
      removePrefix(row[colBIndex]),
      parseFloat(row[valueColIndex]),
    ]);
  }

  return [["From", "To", results.header[2]], ...links];
}

type SankeyChartProps = {
  results: QueryResults;
  width: number;
  height: number;
  variables: VariableCategories;
};

const SankeyChart = ({
  results,
  width,
  height,
  variables,
}: SankeyChartProps) => {
  const data = useMemo(() => {
    const { key, scalar } = variables;
    return getLinks(results, key[0], key[1], scalar[0]);
  }, [variables, results]);

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
    <>
      <Chart chartType="Sankey" data={data} options={options} />
    </>
  );
};

export default SankeyChart;
