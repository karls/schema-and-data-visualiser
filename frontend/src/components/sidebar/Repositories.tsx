import {
  Alert,
  Button,
  Card,
  Input,
  Modal,
  Space,
  Tabs,
  Typography,
} from "antd";
import { useState } from "react";
import { addRemoteRepository } from "../../api/sparql";
import { useStore } from "../../stores/store";
import { observer } from "mobx-react-lite";
import { SlMagnifier } from "react-icons/sl";
import { RepositoryInfo } from "../../types";
import { AiFillApi } from "react-icons/ai";

const Repositories = observer(() => {
  const [open, setOpen] = useState<boolean>(false);
  const items = [
    {
      key: `all-repositories`,
      label: "All Repositories",
      children: <AllRepositories />,
    },
    {
      key: `add-repository`,
      label: "Add Repository",
      children: <AddRepository />,
    },
  ];
  return (
    <div style={{ margin: 5 }}>
      <Button onClick={() => setOpen(true)} style={{ width: "100%" }}>
        <Space>
          <SlMagnifier />
          View repositories
        </Space>
      </Button>
      <Modal open={open} footer={null} onCancel={() => setOpen(false)}>
        <Tabs items={items} />
      </Modal>
    </div>
  );
});

const AddRepository = () => {
  const rootStore = useStore();
  const repositoryStore = rootStore.repositoryStore;
  const authStore = rootStore.authStore;

  const [name, setName] = useState<string>("");
  const [endpoint, setEndpoint] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  if (success) {
    return <Alert message="The repository was added successfully!" />;
  }
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Input
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
        placeholder="Enter a unique name for repository"
      />
      <Input
        value={endpoint}
        onChange={(e) => setEndpoint(e.currentTarget.value)}
        placeholder="Enter URL of SPARQL endpoint"
      />
      <Input.TextArea
        placeholder="Enter a description"
        value={description}
        onChange={(e) => setDescription(e.currentTarget.value)}
      />
      <Button
        onClick={() =>
          addRemoteRepository(
            name,
            endpoint,
            description,
            authStore.username!
          ).then((repositoryId) => {
            setSuccess(true);
            repositoryStore.updateRepositories();
            setTimeout(() => setSuccess(false), 1000);
          })
        }
      >
        Create
      </Button>
    </Space>
  );
};

const AllRepositories = () => {
  const rootStore = useStore();
  const repositoryStore = rootStore.repositoryStore;

  return (
    <Space direction="vertical">
      {repositoryStore.repositories.map(
        ({ name, description, endpoint }: RepositoryInfo, index: number) => (
          <Card title={name} key={`repository-${index}`} type="inner">
            <Space direction="vertical">
              <Typography.Text>{description}</Typography.Text>
              {endpoint && (
                <Space>
                  <AiFillApi size={20} />
                  <Typography.Text>{endpoint}</Typography.Text>
                </Space>
              )}
            </Space>
          </Card>
        )
      )}
    </Space>
  );
};

export default Repositories;
