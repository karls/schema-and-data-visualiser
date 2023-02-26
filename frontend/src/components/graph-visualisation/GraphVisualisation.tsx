import { observer } from "mobx-react-lite";
import { Triplet } from "../../types";
import Graph from "./Graph";

const GraphVisualisation = observer(({ results }: { results: Triplet[]}) => {
  return (
    <div style={{ width: "calc(100vw - 200)", height: "70vh" }}>
      <Graph results={results} />
    </div>
  );
});

export default GraphVisualisation;
