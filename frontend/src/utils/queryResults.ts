import { RDFGraph, QueryResults } from "../types";

export function isGraph(results: QueryResults) {
  return (
    results.header.toString() === ["Subject", "Predicate", "Object"].toString()
  );
}

export function emptyGraph(): RDFGraph {
  return {
    header: ["Subject", "Predicate", "Object"],
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

// export function shadeColor(color: string, percent: number) {
//   var R: number = parseInt(color.substring(1, 3), 16);
//   var G = parseInt(color.substring(3, 5), 16);
//   var B = parseInt(color.substring(5, 7), 16);

//   R = (R * (100 + percent)) / 100;
//   G = (G * (100 + percent)) / 100;
//   B = (B * (100 + percent)) / 100;

//   R = R < 255 ? R : 255;
//   G = G < 255 ? G : 255;
//   B = B < 255 ? B : 255;

//   R = Math.round(R);
//   G = Math.round(G);
//   B = Math.round(B);

//   var RR = R.toString(16).length === 1 ? "0" + R.toString(16) : R.toString(16);
//   var GG = G.toString(16).length === 1 ? "0" + G.toString(16) : G.toString(16);
//   var BB = B.toString(16).length === 1 ? "0" + B.toString(16) : B.toString(16);
//   console.log("#" + RR + GG + BB)
//   return "#" + RR + GG + BB;
// }

export function shadeColor(color, amount) {
  return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}
