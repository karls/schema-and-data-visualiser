import { useEffect, useState } from "react";
import { Collapse, List, Skeleton, Tooltip, Typography } from "antd";
import { RepositoryId, URI } from "../../types";
import { removePrefix } from "../../utils/queryResults";
import { getTypeProperties, getAllTypes } from "../../api/dataset";
import { MetaInfo } from "./MetaInfo";
import { useStore } from "../../stores/store";

const { Panel } = Collapse;
const { Text } = Typography;

type TypesProps = {
  repository: RepositoryId;
};

const Types = ({ repository }: TypesProps) => {
  const username = useStore().authStore.username!;

  const [types, setTypes] = useState<URI[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getAllTypes(repository, username).then((res: URI[]) => {
      setTypes(res);
      setLoading(false);
    });
  }, [repository, username]);

  return (
    <Skeleton active loading={loading}>
      <Collapse defaultActiveKey={["1"]} onChange={() => {}}>
        {types.map((type: URI, index) => (
          <Panel
            header={<Tooltip title={type}>{removePrefix(type)}</Tooltip>}
            key={`type-${index}`}
          >
            <MetaInfo repository={repository} uri={type} />
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
  const username = useStore().authStore.username!;

  const [properties, setProperties] = useState<URI[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getTypeProperties(repository, type, username).then((res: URI[]) => {
      setProperties(res);
      setLoading(false);
    });
  }, [repository, type, username]);

  return (
    <List
      header={<Text style={{ fontWeight: "bold" }}>Properties</Text>}
      dataSource={properties}
      renderItem={(property: URI) => (
        <Skeleton active loading={loading}>
          <List.Item>
            <Tooltip placement="topLeft" title={property}>
              <Text>{removePrefix(property)}</Text>
            </Tooltip>
            <MetaInfo repository={repository} uri={property} />
          </List.Item>
        </Skeleton>
      )}
    />
  );
};

export default Types;
