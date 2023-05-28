import {
  ChartType,
  QueryResults,
  RelationType,
  VariableCategories,
} from "../types";

export function possibleCharts(variables: VariableCategories) {
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

  if (key.length >= 2) {
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

export function getColumnRelationship(
  results: QueryResults,
  colA: string,
  colB: string
) {
  const outgoingLinks = {};
  const incomingLinks = {};
  const { header, data } = results;

  const colAIndex = header.indexOf(colA);
  const colBIndex = header.indexOf(colB);

  for (let row of data) {
    const source = row[colAIndex];
    const target = row[colBIndex];

    outgoingLinks[source] = outgoingLinks[source] ?? new Set();
    outgoingLinks[source].add(target);

    incomingLinks[target] = incomingLinks[target] ?? new Set();
    incomingLinks[target].add(source);
  }
  let oneToOne = true;
  let oneToMany = true;
  let manyToOne = true;
  let manyToMany = true;

  for (let parent of Object.keys(outgoingLinks)) {
    const children = outgoingLinks[parent];
    if (children.size > 1) {
      oneToOne = false;
      manyToOne = false;
    }

    if (((oneToOne !== oneToMany) !== manyToOne) !== manyToMany) {
      break;
    }
  }

  for (let child of Object.keys(incomingLinks)) {
    const parents = incomingLinks[child];

    if (parents.size > 1) {
      oneToOne = false;
      oneToMany = false;
    }

    if (((oneToOne !== oneToMany) !== manyToOne) !== manyToMany) {
      break;
    }
  }

  let relationType = RelationType.MANY_TO_MANY;

  if (oneToOne) {
    relationType = RelationType.ONE_TO_ONE;
  } else if (oneToMany) {
    relationType = RelationType.ONE_TO_MANY;
  } else if (manyToOne) {
    relationType = RelationType.MANY_TO_ONE;
  }
  return { relationType, incomingLinks, outgoingLinks };
}
