import { observer } from "mobx-react-lite";
import { Triplet } from "../../types";
import GraphVis from "../graph/GraphVis";
import Fullscreen from "./Fullscreen";
import { useStore } from "../../stores/store";

const Graph = observer(({ results }: { results: Triplet[]}) => {
  const rootStore = useStore();
  const settings = rootStore.settingsStore;

  const width = Math.floor(
    (window.screen.width - (settings.fullScreen ? 0 : settings.sidebarWidth)) *
      (settings.fullScreen ? 0.98 : 0.85)
  );
  const height = Math.floor(
    window.screen.height * (settings.fullScreen ? 0.95 : 0.6)
  );
  return (
    <Fullscreen>
      <GraphVis results={results} width={width} height={height} />
    </Fullscreen>
  );
});

export default Graph;
