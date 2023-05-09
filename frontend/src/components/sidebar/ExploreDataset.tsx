import { Tabs, TabsProps } from "antd";
import { RepositoryId } from "../../types";

type ExploreDatasetProps = {
  repository: RepositoryId;
};

const ExploreDataset = ({ repository }: ExploreDatasetProps) => {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `General`,
      children: <GeneralInfo repository={repository}></GeneralInfo>,
    },
  ];
  return <Tabs defaultActiveKey="1" items={items} style={{ padding: 10 }} />;
};

const GeneralInfo = ({ repository }: ExploreDatasetProps) => {
  return <></>;
};

export default ExploreDataset;
