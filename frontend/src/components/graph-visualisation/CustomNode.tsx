import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { removePrefix } from "../../utils/queryResults";
import { Tooltip } from "antd";

const CustomNode = ({
  data,
  // isConnectable,
  targetPosition = Position.Top,
  sourcePosition = Position.Bottom,
}: NodeProps) => {
  return (
    <Tooltip placement="topLeft" title={data?.label}>
      <Handle
        type="target"
        position={targetPosition}
        isConnectable={false}
      />
      {removePrefix(data?.label)}
      <Handle
        type="source"
        position={sourcePosition}
        isConnectable={false}
      />
    </Tooltip>
  );
};

CustomNode.displayName = "CustomNode";

export default memo(CustomNode);
