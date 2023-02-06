import { useCallback } from "react";
import ReactFlow, {
  Node,
  addEdge,
  Background,
  Edge,
  Connection,
  useNodesState,
  useEdgesState,
  MiniMap,
} from "reactflow";

import CustomNode from "./CustomNode";
import "./graph.css";
import "reactflow/dist/style.css";

const initialNodes: Node[] = [
  {
    id: "1",
    type: "input",
    data: {
      label: "United Kingdom",
    },
    position: { x: 500, y: 100 },
  },
  {
    id: "2",
    type: "output",
    data: {
      label: "London",
    },
    position: { x: 300, y: 300 },
  },
  {
    id: "3",
    type: "custom",
    data: {
      label: "67,081,234",
    },
    position: { x: 700, y: 300 },
  },
];
const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", label: "capital", animated: true },
  { id: "e1-3", source: "1", target: "3", label: "population", animated: true },
];

const nodeTypes = {
  custom: CustomNode,
};

const minimapStyle = {
  height: 120,
};

const Demo = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((els) => addEdge(params, els)),
    [setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      // onConnect={onConnect}
      nodeTypes={nodeTypes}
    >
      <Background />
      <MiniMap style={minimapStyle} zoomable pannable />
    </ReactFlow>
  );
};

export default Demo;
