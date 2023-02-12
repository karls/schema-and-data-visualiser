import React, { useEffect, useState } from "react";
import { Button, Dropdown, Popover } from "antd";
import { allRepositories } from "../../api/repository";
import { useStore } from "../../stores/store";
import { RepositoryInfo } from "../../types";
import { observer } from "mobx-react-lite";

const Sidebar = observer(() => {
  const { settings } = useStore();
  const [repositories, setRepositories] = useState<RepositoryInfo[]>([]);

  useEffect(() => {
    allRepositories().then((repositories) => {
      setRepositories(repositories);
    });
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
                    onClick={() => settings.setCurrentRepository(id)}
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
        <Button style={{ width: "95%", margin: 5 }}>
          <b>{settings.currentRepository || "Select repository"}</b>
        </Button>
      </Dropdown>
    </div>
  );
});

export default Sidebar;
