import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Button, Popconfirm, Popover, Space, Typography } from "antd";
import { useStore } from "../../stores/store";
import { MdDelete } from "react-icons/md";

const { Title, Text } = Typography;

const QueryHistory = observer(() => {
  const rootStore = useStore();
  const repositoryStore = rootStore.repositoryStore;

  useEffect(() => {
    repositoryStore.updateQueryHistory();
  }, [repositoryStore]);

  return (
    <div
      style={{
        width: "100%",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Title level={4} style={{ margin: "auto", marginBottom: 5 }}>
        History
      </Title>
      {repositoryStore.getCurrentRepository() === null && (
        <Text style={{ padding: 5 }}>
          Select a repository to see the queries you have run in the past
        </Text>
      )}
      {repositoryStore.getCurrentRepository() &&
        repositoryStore.getQueryHistory().length === 0 && (
          <Text style={{ padding: 5 }}>
            There are no queries for this repository
          </Text>
        )}
      <Space
        style={{
          maxHeight: 500,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {repositoryStore
          .getQueryHistory()
          .map(({ id, sparql, repositoryId, date }) => (
            <Popover
              key={`query-${id}`}
              placement="right"
              title={`Repository: ${repositoryId}`}
              content={<div style={{ whiteSpace: "pre-line" }}>{sparql}</div>}
              trigger="hover"
            >
              <Button onClick={() => {}}>{date}</Button>
            </Popover>
          ))}
      </Space>
      <DeleteHistory />
    </div>
  );
});

const DeleteHistory = observer(() => {
  const rootStore = useStore();
  const repositoryStore = rootStore.repositoryStore;

  return (
    <Popconfirm
      title={"Clear entire history"}
      description={`Are you sure?`}
      okText="Yes"
      cancelText="No"
      onConfirm={() => repositoryStore.clearQueryHistory()}
      style={{ justifyContent: "center" }}
      placement="right"
    >
      <Button
        danger
        style={{ margin: "auto", width: '95%' }}
        disabled={repositoryStore.queryHistory.length === 0}
        title="Clear history"
      >
        <MdDelete size={20} />
      </Button>
    </Popconfirm>
  );
});

export default QueryHistory;
