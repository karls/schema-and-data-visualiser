import React, { useEffect, useState } from "react";
import { Button, Divider, Dropdown, Modal, Popover, Space } from "antd";
import { allRepositories } from "../../api/graphdb";
import { useStore } from "../../stores/store";
import { RepositoryInfo } from "../../types";
import { observer } from "mobx-react-lite";
import { RiGitRepositoryLine } from "react-icons/ri";
import QueryHistory from "./QueryHistory";
import ExploreDataset from "./ExploreDataset";
import { MdOutlineExplore } from "react-icons/md";

const Sidebar = observer(() => {
  const rootStore = useStore();
  const repositoryStore = rootStore.repositoryStore;

  const [repositories, setRepositories] = useState<RepositoryInfo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    allRepositories().then((repositories) => setRepositories(repositories));
  }, []);

  return (
    <div style={{ justifyContent: "center" }}>
      <Dropdown
        menu={{
          items: repositories.map(({ id, title }: RepositoryInfo, index) => {
            return {
              key: `${index}`,
              label: (
                <Popover
                  placement="right"
                  title={title ? "Description" : "No description available"}
                  content={title}
                  trigger="hover"
                >
                  <Button
                    onClick={() => repositoryStore.setCurrentRepository(id)}
                    style={{ width: "100%", height: "100%" }}
                  >
                    {id}
                  </Button>
                </Popover>
              ),
            };
          }),
        }}
      >
        <Button style={{ width: "95%", margin: 5 }} title="Choose repository">
          <Space>
            <RiGitRepositoryLine size={20} />
            <b>{repositoryStore.currentRepository || "Select repository"}</b>
          </Space>
        </Button>
      </Dropdown>

      <Button
        type="primary"
        disabled={repositoryStore.currentRepository === null}
        onClick={() => setIsModalOpen(true)}
        style={{ width: "95%", margin: "auto" }}
      >
        <Space>
          <MdOutlineExplore size={20} />
          Explore Dataset
        </Space>
      </Button>
      {repositoryStore.currentRepository && (
        <Modal
          title={`${repositoryStore.currentRepository}`}
          open={isModalOpen}
          footer={null}
          onCancel={() => setIsModalOpen(false)}
          width={Math.floor(window.screen.width * 0.75)}
          maskClosable
        >
          <ExploreDataset repository={repositoryStore.currentRepository} />
        </Modal>
      )}

      <Divider />
      <QueryHistory />
    </div>
  );
});

export default Sidebar;
