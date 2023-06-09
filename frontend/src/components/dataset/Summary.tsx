import { useEffect, useState } from "react";
import { Divider, Space, Statistic } from "antd";
import { RepositoryId, URI } from "../../types";
import { getClasses, getNoOfTriplets } from "../../api/dataset";
import { useStore } from "../../stores/store";

type SummaryProps = {
  repository: RepositoryId;
};

export const Summary = ({ repository }: SummaryProps) => {
  return (
    <Space>
      <Triplets repository={repository} />
      <Divider type="vertical" style={{ height: 50 }}/>
      <Classes repository={repository} />
    </Space>
  );
};

type TripletsProps = {
  repository: RepositoryId;
};

const Triplets = ({ repository }: TripletsProps) => {
  const username = useStore().authStore.username!;

  const [triplets, setTriplets] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getNoOfTriplets(repository, username).then((res) => {
      setTriplets(res);
      setLoading(false);
    });
  }, [repository, username]);

  return <Statistic title="Triplets" value={triplets} loading={loading} />;
};

type ClassesProps = {
  repository: RepositoryId;
};

const Classes = ({ repository }: ClassesProps) => {
  const username = useStore().authStore.username!

  const [classes, setClasses] = useState<URI[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getClasses(repository, username).then((res) => {
      setClasses(res);
      setLoading(false);
    });
  }, [repository, username]);

  return <Statistic title="Classes" value={classes.length} loading={loading} />;
};
