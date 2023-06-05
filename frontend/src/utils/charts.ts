import {
  ChartType,
  QueryResults,
  RelationType,
  VariableCategories,
} from "../types";

type RelationMap = { [key: string]: { [key: string]: RelationType } };
type LinkMap = { [key: string]: Set<string> };

export function recommendedCharts(
  variables: VariableCategories,
  allRelations: RelationMap
) {
  const { scalar, geographical, key, lexical, date, numeric } =
    variables;

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

  if (key.length === 1 && numeric.length >= 1) {
    charts.push(ChartType.BAR);
    if (numeric.length === 2) {
      charts.push(ChartType.LINE);
    }
  }

  if (geographical.length === 1 && scalar.length >= 1) {
    charts.push(ChartType.CHOROPLETH_MAP);
  }

  if ((key.length === 1 || lexical.length === 1) && scalar.length >= 1) {
    charts.push(ChartType.WORD_CLOUD);
  }

  if (key.length >= 2) {
    const isHierarchical = columnsAreHierarchical(allRelations, variables.key);
    if (isHierarchical) {
      charts.push(ChartType.HIERARCHY_TREE);
    } else {
      charts.push(ChartType.NETWORK);
    }
    if (scalar.length >= 1) {
      charts.push(ChartType.STACKED_BAR);
      charts.push(ChartType.GROUPED_BAR);
      charts.push(ChartType.SPIDER);

      if (isHierarchical) {
        charts.push(ChartType.TREE_MAP);
        charts.push(ChartType.SUNBURST);
        charts.push(ChartType.CIRCLE_PACKING);
      } else {
        charts.push(ChartType.HEAT_MAP);
        charts.push(ChartType.CHORD_DIAGRAM);
        charts.push(ChartType.SANKEY);
      }
    }
  }

  return charts;
}

export function getLinks(results: QueryResults, colA: string, colB: string) {
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

  return { incomingLinks, outgoingLinks };
}
export function getColumnRelationship(
  outgoingLinks: LinkMap,
  incomingLinks: LinkMap
) {
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
  return relationType;
}

function getAdjacentRelations(allRelations: RelationMap, columns: string[]) {
  const relations: RelationType[] = [];

  for (let i = 0; i < columns.length - 1; i++) {
    const colA = columns[i];
    const colB = columns[i + 1];
    const relationType = allRelations[colA][colB];
    relations.push(relationType);
  }

  return relations;
}

function columnsAreHierarchical(
  allRelations: RelationMap,
  columns: string[]
): boolean {
  const relations: RelationType[] = getAdjacentRelations(allRelations, columns);
  return relationsAreHierarchical(relations);
}

function relationsAreHierarchical(relations: RelationType[]) {
  for (let r of relations) {
    if (r !== RelationType.ONE_TO_MANY && r !== RelationType.ONE_TO_ONE) {
      return false;
    }
  }
  return true;
}

export function getAllRelations(results: QueryResults, columns: string[]) {
  const allRelations: RelationMap = {};
  const allOutgoingLinks = {};
  const allIncomingLinks = {};

  for (let i = 0; i < columns.length - 1; i++) {
    for (let j = i + 1; j < columns.length; j++) {
      const colA = columns[i];
      const colB = columns[j];
      allRelations[colA] = allRelations[colA] ?? {};
      allOutgoingLinks[colA] = allOutgoingLinks[colA] ?? {};
      allIncomingLinks[colB] = allIncomingLinks[colB] ?? {};

      const { outgoingLinks, incomingLinks } = getLinks(results, colA, colB);
      allOutgoingLinks[colA][colB] = outgoingLinks;
      allIncomingLinks[colB][colA] = incomingLinks;

      const relationType = getColumnRelationship(outgoingLinks, incomingLinks);
      allRelations[colA][colB] = relationType;
    }
  }

  return { allRelations, allOutgoingLinks, allIncomingLinks };
}
