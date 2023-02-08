import React, { useEffect, useState } from "react";
import { Button, Dropdown } from "antd";
import { allRepositories } from "../../api/repository";
import { useStore } from "../../stores/store";
import { RepositoryInfo } from "../../types";
import { observer } from "mobx-react-lite";

const Sidebar = observer(() => {
  const { settings } = useStore();
  const [repositories, setRepositories] = useState<RepositoryInfo[]>([]);

  useEffect(() => {
    allRepositories().then((repositories) => {
      console.log("repositories", repositories);
      setRepositories(repositories);
    });
  }, []);

  return (
    <div style={{ justifyContent: "center" }}>
      {settings.currentRepository && <h4>Current repository:</h4>}
      <Dropdown
        menu={{
          items: repositories.map(({ id }: RepositoryInfo, index) => {
            return {
              key: `${index}`,
              label: (
                <Button
                  onClick={() => settings.setCurrentRepository(id)}
                  style={{ width: "100%" }}
                >
                  {id}
                </Button>
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
