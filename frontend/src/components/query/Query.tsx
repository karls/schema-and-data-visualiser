import { Button, Dropdown, Space, Switch, Tabs, TabsProps } from "antd";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { BiNetworkChart } from "react-icons/bi";
import { TbVectorTriangle } from "react-icons/tb";
import { AiOutlineLineChart } from "react-icons/ai";
import { allRepositories, runSparqlQuery } from "../../api/graphdb";
import { useStore } from "../../stores/store";
import { QueryResults, RepositoryId, RepositoryInfo, Triplet } from "../../types";
import { isEmpty, isGraph } from "../../utils/queryResults";
import GraphVisualisation from "../graph-visualisation/GraphVisualisation";
import Editor from "./Editor";
import Results from "./Results";
import Charts from "../charts/Charts";

const Query: React.FC = observer(() => {
  const rootStore = useStore(); 
  const repositoryStore = rootStore.repositoryStore;

  const [query, setQuery] = useState<string>("");
  const [repository, setRepository] = useState<RepositoryId | null>(
    repositoryStore.getCurrentRepository()
  );
  const [results, setResults] = useState<QueryResults>({ header: [], data: [] });
  const [graphKey, setGraphKey] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [prefix, setPrefix] = useState<boolean>(false);

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
          <Editor query={query} onChange={setQuery} />
          <Space style={{ margin: 5 }}>
            <SelectRepository
              repository={repository}
              setRepository={setRepository}
            />
            <Button
              onClick={() => {
                setLoading(true);
                runSparqlQuery(repository!, query).then((results) => {
                  setResults(results);
                  setLoading(false);
                  setGraphKey((key) => key + 1);
                  repositoryStore.updateQueryHistory();
                });
              }}
              disabled={repository === null}
            >
              Run
            </Button>
          </Space>
          <Switch
            checked={prefix}
            onChange={(checked: boolean) => setPrefix(checked)}
          /> Show Prefix
          <Results results={results} loading={loading} showPrefix={prefix} />
        </>
      ),
    },
    {
      key: "2",
      label: (
        <div title="Use CONSTRUCT for a graph">
          <BiNetworkChart size={20} style={{ margin: 5 }} />
          Graph
        </div>
      ),
      disabled: results.data.length === 0 || !isGraph(results),
      children: <GraphVisualisation key={graphKey} results={results.data as Triplet[]} />,
    },
    {
      key: "3",
      label: (
        <>
          <AiOutlineLineChart size={20} style={{ margin: 5 }} />
          Charts
        </>
      ),
      disabled: isEmpty(results),
      children: <Charts results={results} />,
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
