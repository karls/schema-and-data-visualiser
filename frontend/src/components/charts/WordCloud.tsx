import ReactWordcloud from "react-wordcloud";
import { QueryResults, Row, VariableCategories } from "../../types";
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
  variables: VariableCategories;
};

export const WordCloud = observer(
  ({ results, width, height, variables }: WordCloudProps) => {
    const rootStore = useStore();
    const settings = rootStore.settingsStore;
    
    const data: any = useMemo(() => {
      const textIndex = results.header.indexOf(variables.key[0]);
      const valueIndex = results.header.indexOf(variables.scalar[0]);

      return results.data.map((row: Row) => {
        return {
          text: row[textIndex] as string,
          value: parseFloat(row[valueIndex]),
        };
      });
    }, [results.data, results.header, variables.key, variables.scalar]);

    const options: any = useMemo(() => {
      return {
        enableTooltip: true,
        deterministic: false,
        fontFamily: "impact",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: [20, 30],
        padding: 0,
        margin: 0,
        rotationAngles: [0, 0],
        rotations: 1,
        spiral: "archimedean",
        transitionDuration: 100,
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
      <div style={{ width, height }}>
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
