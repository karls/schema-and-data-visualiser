import { useEffect, useMemo, useState } from "react";
import { PropertyType, RepositoryId, Triplet, URI } from "../../types";
import NetworkGraph, {
  Edge,
  graphData as GraphData,
  Node,
  Options,
} from "react-graph-vis";
import { removePrefix } from "../../utils/queryResults";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores/store";
import "./network.css";
import { getPropertyValues } from "../../api/dataset";

type GraphVisProps = {
  links: Triplet[];
  width: number;
  height: number;
  hierarchical?: boolean;
  repository: RepositoryId;
};

const GraphVis = observer(
  ({ links, width, height, hierarchical, repository }: GraphVisProps) => {
    const rootStore = useStore();
    const settings = rootStore.settingsStore;
    const [loading, setLoading] = useState<boolean>(true);

    const [graph, setGraph] = useState<GraphData>({ nodes: [], edges: [] });

    useEffect(() => {
      setGraph(getNodesAndEdges(links));
    }, [links]);

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
        barnesHut: {
          sprintConstant: 0,
          avoidOverlap: 0.1,
        },
      },
    };

    const events = {
      select: function (event: any) {
        var { nodes, edges } = event;
        // console.log(nodes.map((id) => idToNode[id]));
      },
      beforeDrawing: () => setLoading(true),
      afterDrawing: () => setLoading(false),
      doubleClick: function (event: any) {
        var { nodes, edges } = event;
        // console.log(nodes.map((id) => idToNode[id]));
        for (let nodeId of nodes) {
          const uri = idToNode[nodeId].title!;
          getPropertyValues(
            repository,
            uri,
            PropertyType.DatatypeProperty
          ).then((res: [URI, string][]) => {
            const newLinks: Triplet[] = res.map(([prop, value]) => [
              uri,
              prop,
              value,
            ]);
            setGraph(getNodesAndEdges(newLinks, graph));
          });
        }
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

function getNodesAndEdges(
  links: Triplet[],
  initialGraph: GraphData = { nodes: [], edges: [] }
) {
  const nodeToId: { [key: string]: Node } = {};
  for (let node of initialGraph.nodes) {
    nodeToId[node.title!] = node;
  }
  // Ignore the id of the edges set by the graph as this causes issues for the new edges
  const edges: Edge[] = initialGraph.edges.map(({ from, to, label, title }) => {
    return { from, to, label, title };
  });

  let totalNodes: number = Object.keys(nodeToId).length;

  for (let [sub, pred, obj] of links) {
    let nodeA: Node;
    let nodeB: Node;
    if (nodeToId[sub]) {
      nodeA = nodeToId[sub];
    } else {
      nodeA = {
        id: totalNodes++,
        label: removePrefix(sub),
        title: sub,
      };
      nodeToId[sub] = nodeA;
    }

    if (nodeToId[obj]) {
      nodeB = nodeToId[obj];
    } else {
      nodeB = {
        id: totalNodes++,
        label: removePrefix(obj),
        title: obj,
      };
      nodeToId[obj] = nodeB;
    }

    const edge = {
      from: nodeA.id,
      to: nodeB.id,
      label: removePrefix(pred),
      title: pred,
    };
    edges.push(edge);
  }

  return { nodes: Object.values(nodeToId), edges };
}

export default GraphVis;
