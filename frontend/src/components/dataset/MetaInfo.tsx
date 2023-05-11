import { useEffect, useState } from "react";
import { Descriptions, Skeleton } from "antd";
import { Metadata, RepositoryId, URI } from "../../types";
import { getMetaInformation } from "../../api/dataset";
import { removePrefix } from "../../utils/queryResults";

type MetaInfoProps = {
  repository: RepositoryId;
  uri: URI;
};
export const MetaInfo = ({ repository, uri }: MetaInfoProps) => {
  const [metadata, setMetadata] = useState<Metadata>({
    comment: "",
    label: "",
    range: "",
    domain: "",
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getMetaInformation(repository, uri).then((res: Metadata) => {
      setMetadata(res);
      setLoading(false);
    });
  }, [repository, uri]);

  return (
    <Skeleton loading={loading}>
      <Descriptions size="small" bordered>
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
