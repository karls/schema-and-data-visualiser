import { QueryResults, Triplet, VariableCategories } from "../../types";
import { useMemo } from "react";
import GraphVis from "../graph/GraphVis";

type NetworkChartProps = {
  results: QueryResults;
  width: number;
  height: number;
  variables: VariableCategories;
};

const NetworkChart = ({
  results,
  width,
  height,
  variables,
}: NetworkChartProps) => {
  const { header, data } = results;
  const fromIndex = header.indexOf(variables.key[0]);
  const toIndex = header.indexOf(variables.key[1]);

  const links: Triplet[] = useMemo(
    () => data.map((row) => [row[fromIndex], "", row[toIndex]]),
    [data, fromIndex, toIndex]
  );
  return (
    <GraphVis links={links} width={width} height={height} interactive={false} />
  );
};

export default NetworkChart;
