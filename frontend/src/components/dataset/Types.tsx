import { useEffect, useState } from "react";
import { Collapse, Skeleton } from "antd";
import { RepositoryId, URI } from "../../types";
import { removePrefix } from "../../utils/queryResults";
import { getTypes } from "../../api/dataset";

const { Panel } = Collapse;

type TypesProps = {
  repository: RepositoryId;
};

const Types = ({ repository }: TypesProps) => {
  const [types, setTypes] = useState<URI[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getTypes(repository).then((res: URI[]) => {
      setTypes(res);
      setLoading(false);
    });
  }, [repository]);

  return (
    <Skeleton active loading={loading}>
      <Collapse defaultActiveKey={["1"]} onChange={() => {}}>
        {types.map((type: URI, index) => (
          <Panel header={removePrefix(type)} key={`type-${index}`}>
            <Properties repository={repository} type={type} />
          </Panel>
        ))}
      </Collapse>
    </Skeleton>
  );
};

type PropertiesProps = {
  repository: RepositoryId;
  type: URI;
};
const Properties = ({ repository, type }: PropertiesProps) => {
  return <></>;
};

export default Types;
