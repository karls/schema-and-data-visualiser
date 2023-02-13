import { Button, Dropdown, Space } from "antd";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { allRepositories, runSparqlQuery } from "../../api/repository";
import { useStore } from "../../stores/store";
import { RepositoryId, RepositoryInfo, Triplet } from "../../types";
import QueryEditor from "./QueryEditor";
import QueryResults from "./QueryResults";

const Query: React.FC = observer(() => {
  const { settings }  = useStore(); 
  const [query, setQuery] = useState<string>("");
  const [repository, setRepository] = useState<RepositoryId | null>(settings.currentRepository);
  const [results, setResults] = useState<Triplet[]>([]);

  return (
    <>
      <QueryEditor query={query} onChange={setQuery} />
      <Space>
        <SelectRepository
          repository={repository}
          setRepository={setRepository}
        />
        <Button
          onClick={() => {
            runSparqlQuery(repository!, query).then((results) => {
              setResults(results);
            });
          }}
          disabled={repository === null}
        >
          Run
        </Button>
      </Space>
      <QueryResults results={results} />
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
