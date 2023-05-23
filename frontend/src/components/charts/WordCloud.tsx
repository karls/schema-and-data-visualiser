import { TagCloud } from "react-tagcloud";
import { QueryResults, Row, VariableCategories } from "../../types";
import { useMemo } from "react";
import randomColor from "randomcolor";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores/store";

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
          value: row[textIndex] as string,
          count: parseFloat(row[valueIndex]),
        };
      });
    }, [results.data, results.header, variables.key, variables.scalar]);

    const customRenderer = (tag, size, color) => (
      <span
        key={tag.value}
        style={{
          animation: "blinker 3s linear infinite",
          animationDelay: `${Math.random() * 2}s`,
          fontSize: size,
          // border: `2px solid ${color}`,
          margin: "3px",
          padding: "3px",
          display: "inline-block",
          // float: 'left',
          color: randomColor({
            luminosity: settings.darkMode ? "light" : "dark",
          }),
        }}
      >
        {tag.value}
      </span>
    );

    return (
      <div
        style={{ justifyContent: "center", width, height }}
      >
        <TagCloud
          tags={data}
          minSize={20}
          maxSize={70}
          randomSeed={42}
          renderer={customRenderer}
        />
      </div>
    );
  }
);

export default WordCloud;
