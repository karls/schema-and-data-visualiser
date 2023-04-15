import React, { FC } from "react";
import { EdgeProps, getBezierPath, EdgeLabelRenderer } from "reactflow";
import { removePrefix } from "../../utils/queryResults";

const CustomEdge: FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <path id={id} className="react-flow__edge-path" d={edgePath} />
      <EdgeLabelRenderer>
        <div
          title={data.label}
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            background: "#ffcc00",
            padding: 10,
            borderRadius: 5,
            fontSize: 12,
            fontWeight: 700,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          {removePrefix(data.label)}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default CustomEdge;
