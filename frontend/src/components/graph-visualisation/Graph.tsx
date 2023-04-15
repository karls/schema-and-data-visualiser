import ReactFlow, {
  Node,
  Background,
  Edge,
  useNodesState,
  useEdgesState,
  MiniMap,
  EdgeTypes,
} from "reactflow";
import "reactflow/dist/style.css";
import "./graph.css";
import { Triplet } from "../../types";
import CustomNode from "./CustomNode";
import CustomEdge from "./CustomEdge";
import getUuidByString from "uuid-by-string";

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

const minimapStyle = {
  height: 120,
};

const Graph = ({ results }: { results: Triplet[] }) => {
  const { nodes: initialNodes, edges: initialEdges } =
    getNodesAndEdges(results);
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
    >
      <Background />
      <MiniMap style={minimapStyle} zoomable pannable />
    </ReactFlow>
  );
};

function createNode({
  id,
  label,
  x,
  y,
}: {
  id: string;
  label: string;
  x?: number;
  y?: number;
}) {
  return {
    id,
    type: "custom",
    data: {
      label,
    },
    position: {
      x: x ?? Math.round((window.screen.width - 200) * Math.random()),
      y: y ?? Math.round(window.screen.height * Math.random()),
    },
  } as Node;
}

function createEdge(nodeA: Node, nodeB: Node, label: string) {
  return {
    id: getUuidByString(`${nodeA.data.label}-${nodeB.data.label}`),
    source: nodeA.id,
    target: nodeB.id,
    data: { label  },
    animated: true,
    type: "custom",
  } as Edge;
}

function getNodesAndEdges(results: Triplet[]) {
  const nodes: Set<Node> = new Set();
  const edges: Edge[] = [];

  results.forEach(([s, p, o], index) => {
    const nodeA = createNode({
      id: getUuidByString(s),
      label: s,
      x: 10,
      y: 100 * index,
    });
    const nodeB = createNode({
      id: getUuidByString(o),
      label: o,
      x: 500,
      y: 100 * index,
    });

    nodes.add(nodeA);
    nodes.add(nodeB);

    const edge = createEdge(nodeA, nodeB, p);
    edges.push(edge);
  });

  return { nodes: Array.from(nodes), edges };
}

export default Graph;
