import { Button, Modal, Space, Tabs, TabsProps } from "antd";
import { RepositoryId } from "../../types";
import { Summary } from "../dataset/Summary";
import ClassHierarchy from "../dataset/ClassHierarchy";
import { useState } from "react";
import { MdOutlineExplore } from "react-icons/md";
import { useStore } from "../../stores/store";
import Types from "../dataset/Types";

export type ExploreDatasetProps = {
  repository: RepositoryId | null;
};

const ExploreDataset = ({ repository }: ExploreDatasetProps) => {
  const rootStore = useStore();
  const repositoryStore = rootStore.repositoryStore;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const width = Math.floor(window.screen.width * 0.8);
  const height = Math.floor(window.screen.height * 0.75);

  const items: TabsProps["items"] = [
    {
      key: "summary",
      label: `Summary`,
      children: <Summary repository={repository!} />,
    },
    {
      key: "class hierarchy",
      label: `Class Hierarchy`,
      children: (
        <ClassHierarchy
          repository={repository!}
          width={width - 50}
          height={height}
        />
      ),
    },
    {
      key: "types",
      label: `Types`,
      children: <Types repository={repository!} />,
    },
  ];
  return (
    <>
      <Button
        type="primary"
        disabled={repositoryStore.currentRepository === null}
        onClick={() => setIsModalOpen(true)}
        style={{ width: "95%", margin: 5 }}
      >
        <Space>
          <MdOutlineExplore size={20} />
          Explore Dataset
        </Space>
      </Button>
      {repository && (
        <Modal
          title={`${repository}`}
          open={isModalOpen}
          footer={null}
          onCancel={() => setIsModalOpen(false)}
          width={width}
          maskClosable
        >
          <Tabs defaultActiveKey="1" items={items} style={{ padding: 10 }} />
        </Modal>
      )}
    </>
  );
};

export default ExploreDataset;
