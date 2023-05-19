import ReactWordcloud from "react-wordcloud";
import { QueryResults, Row } from "../../types";
import { useMemo } from "react";
import randomColor from "randomcolor";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores/store";

import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";

type WordCloudProps = {
  results: QueryResults;
  width: number;
  height: number;
  keyColumn: string;
  scalarColumn: string;
};

export const WordCloud = observer(
  ({ results, width, height, keyColumn, scalarColumn }: WordCloudProps) => {
    const rootStore = useStore();
    const settings = rootStore.settingsStore;

    const data: any = useMemo(() => {
      const keyIndex = results.header.indexOf(keyColumn);
      const scalarIndex = results.header.indexOf(scalarColumn);

      return results.data.map((row: Row) => {
        return {
          text: row[keyIndex] as string,
          value: parseFloat(row[scalarIndex]),
        };
      });
    }, [keyColumn, results.data, results.header, scalarColumn]);

    const options: any = useMemo(() => {
      return {
        enableTooltip: true,
        deterministic: false,
        fontFamily: "impact",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: [60, 60],
        padding: 0,
        margin: 0,
        rotationAngles: [0, 0],
        rotations: 1,
        spiral: "rectangular",
        transitionDuration: 1000,
        seed: 0,
      };
    }, []);

    const callbacks = useMemo(() => {
      return {
        getWordColor: (word) =>
          randomColor({ luminosity: settings.darkMode ? "light" : "dark" }),
      };
    }, [settings.darkMode]);

    return (
      <div style={{ display: 'flex', float: "left" }}>
        <ReactWordcloud
          words={data}
          callbacks={callbacks}
          options={options}
          minSize={[width, height]}
        />
      </div>
    );
  }
);

export default WordCloud;
