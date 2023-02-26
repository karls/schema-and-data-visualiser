import ReactFlow, {
  Node,
  Background,
  Edge,
  useNodesState,
  useEdgesState,
  MiniMap,
} from "reactflow";
import "reactflow/dist/style.css";
import "./graph.css";
import { Triplet } from "../../types";
import CustomNode from "./CustomNode";

const nodeTypes = {
  custom: CustomNode,
};

const minimapStyle = {
  height: 120,
};

const Graph = ({ results }: { results: Triplet[] }) => {
  const { nodes: initialNodes, edges: initialEdges } =
    getNodesAndEdges(results);
  //   console.log(initialNodes, initialEdges);
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
    >
      <Background />
      <MiniMap style={minimapStyle} zoomable pannable />
    </ReactFlow>
  );
};

function createNode({ id, label }: { id: string; label: string }) {
  return {
    id,
    type: "custom",
    data: {
      label,
    },
    position: {
      x: Math.round((window.screen.width - 200) * Math.random()),
      y: Math.round(window.screen.height * Math.random()),
    },
  } as Node;
}

function createEdge([s, p, o]: Triplet) {
  return {
    id: `e${s ?? ""}-${o ?? ""}`,
    source: s ?? "",
    target: o ?? "",
    label: p ?? "",
    animated: true,
  } as Edge;
}

function getNodesAndEdges(results: Triplet[]) {
  const nodes: Set<Node> = new Set();
  const edges: Edge[] = [];

  results.forEach(([s, p, o]) => {
    const nodeA = createNode({
      id: s,
      label: s,
    });
    const nodeB = createNode({
      id: o,
      label: o,
    });

    nodes.add(nodeA);
    nodes.add(nodeB);

    const edge = createEdge([s, p, o]);
    edges.push(edge);
  });

  return { nodes: Array.from(nodes), edges };
}

export default Graph;
