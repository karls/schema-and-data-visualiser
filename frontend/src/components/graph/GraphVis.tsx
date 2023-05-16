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
import randomColor from "randomcolor";

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
    const [, setLoading] = useState<boolean>(true);

    const [graph, setGraph] = useState<GraphData>({ nodes: [], edges: [] });

    const edgeOptions = useMemo(() => {
      return {
        font: {
          strokeWidth: 0,
          size: 20,
          color: settings.darkMode ? "white" : "black",
        },
      };
    }, [settings.darkMode]);

    useEffect(() => {
      setGraph(
        getNodesAndEdges({
          links,
          nodeOptions: { shape: "box", font: { size: 30 } },
          edgeOptions,
        })
      );
    }, [links, edgeOptions]);

    const idToNode: { [key: number]: Node } = useMemo(() => {
      const dict: { [key: number]: Node } = {};
      for (let node of graph.nodes) {
        dict[node.id as number] = node;
      }

      return dict;
    }, [graph]);

    // -------------------------------------------------------

    const graphOptions: Options = {
      layout: {
        hierarchical: hierarchical ?? false,
      },
      edges: {
        color: settings.darkMode ? "white" : "black",
        font: { size: 10 },
      },
      width: `${width}px`,
      height: `${height}px`,
      // physics: {
      //   enabled: true,
      //   barnesHut: {
      //     // sprintConstant: 1,
      //     avoidOverlap: 0.05,
      //   },
      // },
      physics: {
        forceAtlas2Based: {
          gravitationalConstant: -126,
          springLength: 200,
          springConstant: 0.01,
        },
        maxVelocity: 50,
        solver: "forceAtlas2Based",
        timestep: 0.35,
        stabilization: true,
      },
    };

    const events = {
      select: function (event: any) {
        // var { nodes, edges } = event;
      },
      beforeDrawing: () => setLoading(true),
      afterDrawing: () => setLoading(false),
      doubleClick: function (event: any) {
        var { nodes } = event;
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
            setGraph(
              getNodesAndEdges({
                links: newLinks,
                initialGraph: graph,
                nodeOptions: {
                  color: randomColor({ luminosity: "light" }),
                  shape: "box",
                },
                edgeOptions,
              })
            );
          });
        }
      },
      hold: function (event: any) {
        var { nodes } = event;
        for (let nodeId of nodes) {
          const uri = idToNode[nodeId].title!;
          getPropertyValues(repository, uri, PropertyType.ObjectProperty).then(
            (res: [URI, string][]) => {
              const newLinks: Triplet[] = res.map(([prop, value]) => [
                uri,
                prop,
                value,
              ]);
              setGraph(
                getNodesAndEdges({
                  links: newLinks,
                  nodeOptions: {
                    shape: 'ellipse',
                    color: randomColor({ luminosity: "light" }),
                    font: { size: 30 },
                  },
                  edgeOptions,
                })
              );
            }
          );
        }
      },
    };

    return (
      <NetworkGraph
        graph={graph}
        options={graphOptions}
        events={events}
        getNetwork={(network: any) => {
          //  if you want access to vis.js network api you can set the state in a parent component using this property
        }}
      />
    );
  }
);

function getNodesAndEdges({
  links,
  initialGraph = { nodes: [], edges: [] },
  nodeOptions = {},
  edgeOptions = {},
}: {
  links: Triplet[];
  initialGraph?: GraphData;
  nodeOptions?: any;
  edgeOptions?: any;
}) {
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
        ...nodeOptions,
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
        ...nodeOptions,
      };
      nodeToId[obj] = nodeB;
    }

    const edge = {
      from: nodeA.id,
      to: nodeB.id,
      label: removePrefix(pred),
      title: pred,
      ...edgeOptions,
    };
    edges.push(edge);
  }

  return { nodes: Object.values(nodeToId), edges };
}

export default GraphVis;
