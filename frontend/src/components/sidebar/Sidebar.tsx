import { useEffect, useState } from "react";
import { Button, Dropdown, Popover, Space } from "antd";
import { allRepositories } from "../../api/sparql";
import { useStore } from "../../stores/store";
import { RepositoryInfo } from "../../types";
import { observer } from "mobx-react-lite";
import { RiGitRepositoryLine } from "react-icons/ri";
import QueryHistory from "./QueryHistory";
import ExploreDataset from "./ExploreDataset";

const Sidebar = observer(() => {
  const rootStore = useStore();
  const settings = rootStore.settingsStore;
  const repositoryStore = rootStore.repositoryStore;

  return (
    <>
      {!settings.sidebarCollapsed && (
        <div style={{ justifyContent: "center" }}>
          <SelectRepository />
          <ExploreDataset repository={repositoryStore.currentRepository} />
          <QueryHistory />
        </div>
      )}
    </>
  );
});

const SelectRepository = () => {
  const rootStore = useStore();
  const repositoryStore = rootStore.repositoryStore;
  const [repositories, setRepositories] = useState<RepositoryInfo[]>([]);

  useEffect(() => {
    allRepositories().then((repositories) => setRepositories(repositories));
  }, []);

  return (
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
  );
};
export default Sidebar;
