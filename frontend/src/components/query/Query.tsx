import { Button, Dropdown, Space, Tabs, TabsProps } from "antd";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { BiNetworkChart } from "react-icons/bi";
import { TbVectorTriangle } from "react-icons/tb";
import { allRepositories, runSparqlQuery } from "../../api/repository";
import { useStore } from "../../stores/store";
import { RepositoryId, RepositoryInfo, Triplet } from "../../types";
import GraphVisualisation from "../graph-visualisation/GraphVisualisation";
import QueryEditor from "./QueryEditor";
import QueryResults from "./QueryResults";

const Query: React.FC = observer(() => {
  const { settings } = useStore();
  const [query, setQuery] = useState<string>("");
  const [repository, setRepository] = useState<RepositoryId | null>(
    settings.currentRepository
  );
  const [results, setResults] = useState<Triplet[]>([]);
  const [graphKey, setGraphKey] = useState<number>(0);

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
                runSparqlQuery(repository!, query).then((results) => {
                  setResults(results);
                  setGraphKey((key) => key + 1); 
                });
              }}
              disabled={repository === null}
            >
              Run
            </Button>
          </Space>
          <QueryResults results={results} />
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
      children: <GraphVisualisation key={graphKey} results={results} />,
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
