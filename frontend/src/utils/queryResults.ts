import { QueryResult } from "../types";

export function isGraph(results: QueryResult) {
  return (
    results.header.toString() === ["Subject", "Predicate", "Object"].toString()
  );
}

export function isEmpty(results: QueryResult) {
  return results.data.length === 0;
}

export function removePrefix(uri: string): string {
  uri = uri.slice(1, -1);
  const tokens = uri.split("/").filter((t) => t !== "");
  if (tokens.length === 0) return "";
  const name = tokens.at(-1);
  return name!.split("#").at(-1) ?? "";
}
