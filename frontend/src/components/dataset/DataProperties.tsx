import { useEffect, useState } from "react";
import { getDataPropertyValues } from "../../api/dataset";
import { Descriptions, Skeleton } from "antd";
import { removePrefix } from "../../utils/queryResults";

export const DataProperties = ({ repository, uri }) => {
  const [data, setData] = useState<{ [key: string]: string; }>({});
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    getDataPropertyValues(repository, uri).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [repository, uri]);

  return (
    <Skeleton loading={loading}>
      <Descriptions size="small" bordered>
        {Object.keys(data).map((prop: string) => (
          <Descriptions.Item key={prop} label={removePrefix(prop)}>
            {removePrefix((data as any)[prop])}
          </Descriptions.Item>
        ))}
      </Descriptions>
    </Skeleton>
  );
};
