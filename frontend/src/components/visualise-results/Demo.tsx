import ReactFlow, {
  Node,
  Background,
  Edge,
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

export default Demo;
