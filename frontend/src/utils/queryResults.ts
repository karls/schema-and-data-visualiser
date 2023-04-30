import { QueryResults } from "../types";

export function isGraph(results: QueryResults) {
  return (
    results.header.toString() === ["Subject", "Predicate", "Object"].toString()
  );
}

export function isEmpty(results: QueryResults) {
  return results.data.length === 0;
}

export function isURL(text: string) {
  const URL_REGEX =
    /https?:\/\/(www\.)?(([-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6})|localhost)\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
  return text.match(URL_REGEX);
}

export function removePrefix(text: string): string {
  if (!isURL(text)) return text;
  const uri = text;
  const tokens = uri.split("/").filter((t) => t !== "");
  if (tokens.length === 0) return "";
  const name = tokens.at(-1);
  return (name!.split("#").at(-1) ?? "").replaceAll("+", " ");
}
