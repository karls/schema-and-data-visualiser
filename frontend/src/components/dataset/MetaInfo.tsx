import { useEffect, useState } from "react";
import { Descriptions, Skeleton, Tag } from "antd";
import { Metadata, RepositoryId, URI } from "../../types";
import { getMetaInformation, getType } from "../../api/dataset";
import { removePrefix } from "../../utils/queryResults";
import { useStore } from "../../stores/store";

type MetaInfoProps = {
  repository: RepositoryId;
  uri: URI;
};
export const MetaInfo = ({ repository, uri }: MetaInfoProps) => {
  const username = useStore().authStore.username!;

  const [metadata, setMetadata] = useState<Metadata>({
    comment: "",
    label: "",
    range: "",
    domain: "",
  });
  const [types, setTypes] = useState<URI[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getMetaInformation(repository, uri, username).then((res: Metadata) => {
      setMetadata(res);
      setLoading(false);
    });
    getType(repository, uri, username).then((res: URI[]) => {
      setTypes(res);
    });
  }, [repository, uri, username]);

  return (
    <Skeleton loading={loading}>
      <Descriptions size="small" layout="vertical"  bordered>
        {types.length > 0 && (
          <Descriptions.Item key="type" label="Type">
            {types.map((t, index) => (
              <Tag key={`type-${index}`} title={t}>{removePrefix(t)}</Tag>
            ))}
          </Descriptions.Item>
        )}

        {Object.keys(metadata).map(
          (field: string) =>
            (metadata as any)[field].trim() && (
              <Descriptions.Item key={field} label={field}>
                {removePrefix((metadata as any)[field])}
              </Descriptions.Item>
            )
        )}
      </Descriptions>
    </Skeleton>
  );
};
