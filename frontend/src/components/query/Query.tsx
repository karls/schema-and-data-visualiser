import { Button, Dropdown, Space, Tabs, TabsProps } from "antd";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { BiNetworkChart } from "react-icons/bi";
import { TbVectorTriangle } from "react-icons/tb";
import { allRepositories, runSparqlQuery } from "../../api/repository";
import { useStore } from "../../stores/store";
import { QueryResult, RepositoryId, RepositoryInfo } from "../../types";
import GraphVisualisation from "../graph-visualisation/GraphVisualisation";
import QueryEditor from "./QueryEditor";
import QueryResults from "./QueryResults";

const Query: React.FC = observer(() => {
  const { settings } = useStore();
  const [query, setQuery] = useState<string>("");
  const [repository, setRepository] = useState<RepositoryId | null>(
    settings.currentRepository
  );
  const [results, setResults] = useState<QueryResult>({ header: [], data: []});
  const [graphKey, setGraphKey] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: (
        <>
          <TbVectorTriangle size={20} style={{ margin: 5 }} />
          Query Editor
        </>
      ),
      children: (
        <>
          <QueryEditor query={query} onChange={setQuery} />
          <Space style={{ margin: 5 }}>
            <SelectRepository
              repository={repository}
              setRepository={setRepository}
            />
            <Button
              onClick={() => {
                setLoading(true)
                runSparqlQuery(repository!, query).then((results) => {
                  setResults(results);
                  setLoading(false);
                  setGraphKey((key) => key + 1); 
                });
              }}
              disabled={repository === null}
            >
              Run
            </Button>
          </Space>
          <QueryResults results={results} loading={loading} />
        </>
      ),
    },
    {
      key: "2",
      label: (
        <>
          <BiNetworkChart size={20} style={{ margin: 5 }} />
          Graph
        </>
      ),
      disabled: results.data.length === 0,
      children: <GraphVisualisation key={graphKey} results={results.data} />,
    },
  ];

  return (
    <>
      <Tabs items={items} onChange={() => {}} />
    </>
  );
});

const SelectRepository = ({
  repository,
  setRepository,
}: {
  repository: string | null;
  setRepository: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const [repositories, setRepositories] = useState<RepositoryInfo[]>([]);

  useEffect(() => {
    allRepositories().then((repositories) => {
      setRepositories(repositories);
    });
  }, []);

  return (
    <Dropdown
      menu={{
        items: repositories.map(({ id, title }: RepositoryInfo, index) => {
          return {
            key: `${index}`,
            label: (
              <Button
                onClick={() => setRepository(id)}
                style={{ width: "100%", height: "100%" }}
              >
                {id}
              </Button>
            ),
          };
        }),
      }}
    >
      <Button>{repository || "Choose repository"}</Button>
    </Dropdown>
  );
};

export default Query;
