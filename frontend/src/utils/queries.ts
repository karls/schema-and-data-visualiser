export function getPrefixes(sparql: string): { [key: string]: string } {
  const lines = sparql.split("\n");
  const lineTokens: any = lines.map((line) =>
    line.split(" ").filter((t) => t !== "")
  );
  const prefixLines = lineTokens.filter(
    (tokens: string[]) =>
      tokens.length > 0 && tokens[0].toLowerCase() === "prefix"
  );
  const prefixes: { [key: string]: string } = {};
  prefixLines.forEach(
    ([_, prefixName, namespaceURI]: [string, string, string]) => {
      prefixes[namespaceURI] = prefixName;
    }
  );
  return prefixes;
}