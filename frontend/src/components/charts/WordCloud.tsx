import ReactWordcloud from "react-wordcloud";
import { QueryResults, Row } from "../../types";
import { useMemo } from "react";

type WordCloudProps = {
  results: QueryResults;
  width: number;
  height: number;
  keyColumn: string;
  scalarColumn: string;
};

export const WordCloud = ({
  results,
  width,
  height,
  keyColumn,
  scalarColumn,
}: WordCloudProps) => {
  const words: { text: string; value: number }[] = useMemo(() => {
    const keyIndex = results.header.indexOf(keyColumn);
    const scalarIndex = results.header.indexOf(scalarColumn);

    return results.data.map((row: Row) => {
      return {
        text: row[keyIndex],
        value: row[scalarIndex],
      };
    });
  }, [keyColumn, results.data, results.header, scalarColumn]);

  return <ReactWordcloud words={words} />;
};

export default WordCloud;
