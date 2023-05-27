import { ChartType, VariableCategories } from "../types";

function possibleCharts(variables: VariableCategories) {
  const { scalar, temporal, geographical, key, lexical, date } = variables;

  const charts: ChartType[] = [];

  if (date.length === 1 && scalar.length >= 1) {
    charts.push(ChartType.CALENDAR);
  }

  if (scalar.length >= 2) {
    charts.push(ChartType.SCATTER);

    if (scalar.length >= 3) {
      charts.push(ChartType.BUBBLE);
    }
  }

  if (key.length === 1 && scalar.length >= 1) {
    charts.push(ChartType.BAR);
  }

  if (geographical.length === 1 && scalar.length >= 1) {
    charts.push(ChartType.CHOROPLETH_MAP);
  }

  if ((key.length === 1 || lexical.length === 1) && scalar.length >= 1) {
    charts.push(ChartType.WORD_CLOUD);
  }

  if (key.length === 2) {
    charts.push(ChartType.HIERARCHY_TREE);
    if (scalar.length >= 1) {
      charts.push(ChartType.TREE_MAP);
      charts.push(ChartType.SUNBURST);
      charts.push(ChartType.CIRCLE_PACKING);
      charts.push(ChartType.SANKEY);
      charts.push(ChartType.HEAT_MAP);
      charts.push(ChartType.CHORD_DIAGRAM);

      charts.push(ChartType.SPIDER);
      if (scalar.length >= 2 && scalar.includes(key[1])) {
        charts.push(ChartType.LINE);
        charts.push(ChartType.STACKED_BAR);
        charts.push(ChartType.GROUPED_BAR);
      }
    }
  }

  return charts;
}

export { possibleCharts };
