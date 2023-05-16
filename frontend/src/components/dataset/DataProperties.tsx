import { useEffect, useState } from "react";
import { getPropertyValues } from "../../api/dataset";
import { Descriptions, Skeleton } from "antd";
import { removePrefix } from "../../utils/queryResults";
import { PropertyType, RepositoryId, URI } from "../../types";

type PropertyValuesProps = {
  repository: RepositoryId;
  uri: URI;
  propType: PropertyType;
};

export const PropertyValues = ({
  repository,
  uri,
  propType,
}: PropertyValuesProps) => {
  const [data, setData] = useState<[URI, string][]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    getPropertyValues(repository, uri, propType).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [repository, uri, propType]);

  return (
    <Skeleton loading={loading}>
      <Descriptions size="small" bordered>
        {data.map(([prop, value]) => (
          <Descriptions.Item key={prop} label={removePrefix(prop)}>
            {removePrefix(value)}
          </Descriptions.Item>
        ))}
      </Descriptions>
    </Skeleton>
  );
};
