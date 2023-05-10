import { useEffect, useState } from "react";
import { Collapse, List, Skeleton, Typography } from "antd";
import { RepositoryId, URI } from "../../types";
import { removePrefix } from "../../utils/queryResults";
import { getTypeProperties, getTypes } from "../../api/dataset";

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
  const [properties, setProperties] = useState<URI[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    getTypeProperties(repository, type).then((res: URI[]) => {
      setProperties(res);
      setLoading(false);
    });
  }, [repository, type]);

  return (
    <List
      header="Properties"
      // bordered
      dataSource={properties}
      renderItem={(item) => (
        <Skeleton active loading={loading}>
          <List.Item>{removePrefix(item)}</List.Item>
        </Skeleton>
      )}
    />
  );
};

export default Types;
