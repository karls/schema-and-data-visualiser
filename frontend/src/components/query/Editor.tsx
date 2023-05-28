import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useStore } from "../../stores/store";
import CodeEditor from "./CodeEditor";
import { allRepositories, runSparqlQuery } from "../../api/sparql";
import { QueryResults, RepositoryId, RepositoryInfo, URI } from "../../types";
import { Button, Dropdown, Space, App as AntdApp, Row, Col } from "antd";
import { FiPlay } from "react-icons/fi";
import { RiGitRepositoryLine } from "react-icons/ri";
import { BiCopy, BiSave } from "react-icons/bi";
import { getAllProperties, getAllTypes } from "../../api/dataset";
import { removePrefix } from "../../utils/queryResults";
import sparql from "../../utils/sparql.json";
import { sparql_templates } from "../../utils/sparql_templates";
import Templates from "./Templates";
import Analysis from "./Analysis";
import { addQueryToHistory } from "../../api/queries";

type QueryEditorProps = {
  query: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  width: number;
  height: number;
  onRun: (results: QueryResults) => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  queryTitle: string;
};

const Editor = ({
  query,
  onChange,
  width,
  height,
  onRun,
  loading,
  setLoading,
  queryTitle,
}: QueryEditorProps) => {
  const rootStore = useStore();
  const settings = rootStore.settingsStore;
  const repositoryStore = rootStore.repositoryStore;
  const queriesStore = rootStore.queriesStore;

  const [repository, setRepository] = useState<RepositoryId | null>(
    repositoryStore.getCurrentRepository()
  );
  const [properties, setProperties] = useState<URI[]>([]);
  const [types, setTypes] = useState<URI[]>([]);

  useEffect(() => {
    if (repository !== null) {
      getAllProperties(repository).then((res) => {
        setProperties(res);
      });
      getAllTypes(repository).then((res) => {
        setTypes(res);
      });
    }
  }, [repository]);

  const { notification } = AntdApp.useApp();

  const showNotification = (time: number) => {
    notification.info({
      message: "Query finished!",
      description: `Got results in ${time} ms`,
      placement: "top",
      duration: 3,
    });
  };

  return (
    <Row gutter={10}>
      <Col span={12}>
        {/* <Space direction="vertical" style={{ width: "100%" }}> */}
        <Space>
          <Space style={{ margin: 5 }}>
            <SelectRepository
              repository={repository}
              setRepository={setRepository}
            />
          </Space>
          <Button
            icon={<FiPlay size={20} />}
            loading={loading}
            onClick={() => {
              setLoading(true);
              const start = new Date().getTime();
              runSparqlQuery(
                repository!,
                queriesStore.currentQuery.sparql
              ).then((results) => {
                showNotification(new Date().getTime() - start);
                onRun(results);
              });
            }}
            disabled={repository === null}
            style={{ alignItems: "center" }}
          >
            Run
          </Button>
          <CopyToClipboard text={query} />
          <SaveQuery repository={repository} query={query} title={queryTitle} />
          <Templates templates={sparql_templates} />
        </Space>

        <CodeEditor
          code={query}
          setCode={onChange}
          language="sparql"
          completions={{
            keywords: sparql.keywords,
            properties: properties.map((prop) => removePrefix(prop)),
            types: types.map((t) => removePrefix(t)),
            variables: getTokens(query).filter((token) => isVariable(token)),
          }}
          darkTheme={settings.darkMode}
          width={Math.floor(width / 2)}
          height={height}
        />
      </Col>
      <Col span={12}>
        {repository && <Analysis query={query} repository={repository} />}
      </Col>
    </Row>
    // </Space>
  );
};

function getTokens(text: string): string[] {
  return text.split(/[\s,]+/).map((token) => token.trim());
}

function isVariable(text: string): boolean {
  return text.length > 1 && text.charAt(0) === "?";
}

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
      <Button title="Choose repository">
        <Space>
          <RiGitRepositoryLine size={20} />
          {repository || "Choose repository"}
        </Space>
      </Button>
    </Dropdown>
  );
};

const CopyToClipboard = ({ text }: { text: string }) => {
  return (
    <Button
      icon={<BiCopy />}
      onClick={() => navigator.clipboard.writeText(text)}
    >
      Copy
    </Button>
  );
};

const SaveQuery = observer(
  ({
    title,
    query,
    repository,
  }: {
    title: string;
    query: string;
    repository: RepositoryId | null;
  }) => {
    const rootStore = useStore();
    const repositoryStore = rootStore.repositoryStore;
    return (
      <Button
        icon={<BiSave size={20} />}
        disabled={repository === null}
        onClick={() => {
          addQueryToHistory(repository!, query, title).then(() => {
            repositoryStore.updateQueryHistory();
          });
        }}
      >
        Save
      </Button>
    );
  }
);
export default observer(Editor);
