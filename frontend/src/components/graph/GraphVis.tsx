import { useMemo } from "react";
import { Triplet } from "../../types";
import NetworkGraph, {
  Edge,
  graphData as GraphData,
  Node,
  Options,
} from "react-graph-vis";
import { removePrefix } from "../../utils/queryResults";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores/store";

type GraphVisProps = {
  triplets: Triplet[];
  width: number;
  height: number;
};

const GraphVis = observer(({ triplets, width, height }: GraphVisProps) => {
  const rootStore = useStore();
  const settings = rootStore.settingsStore;

  const graph: GraphData = useMemo(
    () => getNodesAndEdges(triplets),
    [triplets]
  );

  const options: Options = {
    layout: {
      hierarchical: false,
    },
    edges: {
      color: settings.darkMode ? "white" : "black",
      font: { size: 10 },
    },
    width: `${width}px`,
    height: `${height}px`,
    physics: {
      enabled: true,
    },
  };

  const events = {
    select: function (event: any) {
      var { nodes, edges } = event;
    },
  };

  return (
    <NetworkGraph
      graph={graph}
      options={options}
      events={events}
      getNetwork={(network: any) => {
        //  if you want access to vis.js network api you can set the state in a parent component using this property
      }}
    />
  );
});

function getNodesAndEdges(results: Triplet[]) {
  const nodes: { [key: string]: Node } = {};
  const edges: Edge[] = [];

  let totalNodes = 0;

  for (let [sub, pred, obj] of results) {
    let nodeA: Node;
    let nodeB: Node;
    if (nodes[sub]) {
      nodeA = nodes[sub];
    } else {
      nodeA = {
        id: totalNodes++,
        label: removePrefix(sub),
      };
      nodes[sub] = nodeA;
    }

    if (nodes[obj]) {
      nodeB = nodes[obj];
    } else {
      nodeB = {
        id: totalNodes++,
        label: removePrefix(obj),
      };
      nodes[obj] = nodeB;
    }

    const edge = { from: nodeA.id, to: nodeB.id, label: removePrefix(pred) };
    edges.push(edge);
  }

  return { nodes: Object.values(nodes), edges };
}

export default GraphVis;
