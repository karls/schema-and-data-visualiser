import { RDFGraph, QueryResults, Row } from "../types";

export function isGraph(results: QueryResults) {
  return results.header.length === 3;
}

export function emptyGraph(): RDFGraph {
  return {
    header: ["subject", "predicate", "object"],
    data: [],
  };
}

export function isEmpty(results: QueryResults) {
  return results.data.length === 0;
}

export function isURL(text: string) {
  const URL_REGEX =
    /https?:\/\/(www\.)?(([-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6})|localhost)\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
  return text && text.match(URL_REGEX);
}

export function removePrefix(text: string): string {
  if (!isURL(text)) return text;
  const uri = text;
  const tokens = uri.split("/").filter((t) => t !== "");
  if (tokens.length === 0) return "";
  const name = tokens.at(-1);
  return (name!.split("#").at(-1) ?? "").replaceAll("+", " ");
}

export function convertToJSON(
  results: QueryResults,
  columnIndices: number[],
  newColumnNames: string[] = []
) {
  return results.data.map((row) => {
    const values: { [key: string]: any } = {};
    columnIndices.forEach((i) => {
      values[newColumnNames[i] || results.header[i]] = row[i];
    });
    return values;
  });
}

export function numericColumns(results: QueryResults): number[] {
  if (isEmpty(results)) {
    return [];
  }

  const columnIndices: number[] = [];
  const row = results.data[0];
  for (let i = 0; i < row.length; i++) {
    if (!isNaN(row[i] as any) && !isNaN(parseFloat(row[i]))) {
      columnIndices.push(i);
    }
    columnIndices.push();
  }
  return columnIndices;
}

export function categoricalColumns(results: QueryResults): number[] {
  if (isEmpty(results)) {
    return [];
  }

  const columnIndices: number[] = [];
  const row = results.data[0];
  for (let i = 0; i < row.length; i++) {
    if (isNaN(row[i] as any) && isNaN(parseFloat(row[i]))) {
      columnIndices.push(i);
    }
    columnIndices.push();
  }
  return columnIndices;
}

export function shadeColor(color: string, amount: number) {
  return (
    "#" +
    color
      .replace(/^#/, "")
      .replace(/../g, (color) =>
        (
          "0" +
          Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)
        ).substr(-2)
      )
  );
}

export function groupByColumn(
  data: Row[],
  keyColIdx: number
): { [key: string]: Row[] } {
  const keyToRows = {};
  for (let row of data) {
    const key = row[keyColIdx];
    keyToRows[key] = keyToRows[key] ?? [];
    keyToRows[key].push(row);
  }
  return keyToRows;
}

export function uniqueValues(data: Row[], colIdx: number): string[] {
  const values = new Set<string>();
  for (let row of data) {
    values.add(row[colIdx]);
  }
  return Array.from(values);
}
