import { useMemo, useState } from "react";
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
import './network.css';

type GraphVisProps = {
  triplets: Triplet[];
  width: number;
  height: number;
  hierarchical?: boolean;
};

const GraphVis = observer(
  ({ triplets, width, height, hierarchical }: GraphVisProps) => {
    const rootStore = useStore();
    const settings = rootStore.settingsStore;
    const [loading, setLoading] = useState<boolean>(true);

    const graph: GraphData = useMemo(
      () => getNodesAndEdges(triplets),
      [triplets]
    );

    const idToNode: { [key: number]: Node } = useMemo(() => {
      const dict: { [key: number]: Node } = {};
      for (let node of graph.nodes) {
        dict[node.id as number] = node;
      }

      return dict;
    }, [graph]);

    const options: Options = {
      layout: {
        hierarchical: hierarchical ?? false,
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
        console.log(nodes.map((id) => idToNode[id]));
      },
      beforeDrawing: () => setLoading(true),
      afterDrawing: () => setLoading(false),
      doubleClick: function (event: any) {
        var { nodes, edges } = event;
        console.log(nodes.map((id) => idToNode[id]));
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
  }
);

function getNodesAndEdges(results: Triplet[], initialNodes?) {
  const nodes: { [key: string]: Node } = initialNodes ?? {};
  const edges: Edge[] = [];

  let totalNodes: number = Object.keys(nodes).length;

  for (let [sub, pred, obj] of results) {
    let nodeA: Node;
    let nodeB: Node;
    if (nodes[sub]) {
      nodeA = nodes[sub];
    } else {
      nodeA = {
        id: totalNodes++,
        label: removePrefix(sub),
        title: sub,
      };
      nodes[sub] = nodeA;
    }

    if (nodes[obj]) {
      nodeB = nodes[obj];
    } else {
      nodeB = {
        id: totalNodes++,
        label: removePrefix(obj),
        title: obj,
      };
      nodes[obj] = nodeB;
    }

    const edge = {
      from: nodeA.id,
      to: nodeB.id,
      label: removePrefix(pred),
      title: pred,
    };
    edges.push(edge);
  }

  return { nodes: Object.values(nodes), edges };
}

export default GraphVis;
