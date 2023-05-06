import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useStore } from "../../stores/store";
import CodeEditor from "./CodeEditor";
import { allRepositories, runSparqlQuery } from "../../api/graphdb";
import { QueryResults, RepositoryId, RepositoryInfo } from "../../types";
import { Button, Dropdown, Space, App as AntdApp } from "antd";
import { FiPlay } from "react-icons/fi";
import { RiGitRepositoryLine } from "react-icons/ri";
import { BiCopy } from "react-icons/bi";

type QueryEditorProps = {
  getQueryText: () => string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  width: number;
  height: number;
  onRun: (results: QueryResults) => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const Editor = ({
  getQueryText,
  onChange,
  width,
  height,
  onRun,
  loading,
  setLoading,
}: QueryEditorProps) => {
  const rootStore = useStore();
  const settings = rootStore.settingsStore;
  const repositoryStore = rootStore.repositoryStore;
  const queriesStore = rootStore.queriesStore;

  const [repository, setRepository] = useState<RepositoryId | null>(
    repositoryStore.getCurrentRepository()
  );

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
    <Space direction="vertical">
      <Space>
        <Space style={{ margin: 5 }}>
          <SelectRepository
            repository={repository}
            setRepository={setRepository}
          />
        </Space>
        <Button
          loading={loading}
          onClick={() => {
            setLoading(true);
            const start = new Date().getTime();
            runSparqlQuery(repository!, queriesStore.currentQuery).then((results) => {
              showNotification(new Date().getTime() - start);
              onRun(results);
            });
          }}
          disabled={repository === null}
          style={{ alignItems: "center" }}
        >
          <Space>
            <FiPlay size={20} /> Run
          </Space>
        </Button>
        <CopyToClipboard text={getQueryText()} />
      </Space>
      <CodeEditor
        code={getQueryText()}
        setCode={onChange}
        language="sparql"
        completions={getQueryText()
          .split(/[\s,]+/)
          .map((token) => token.trim())}
        darkTheme={settings.darkMode}
        width={width}
        height={height}
      />
    </Space>
  );
};

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
    <Button onClick={() => navigator.clipboard.writeText(text)}>
      <Space>
        <BiCopy />
        Copy
      </Space>
    </Button>
  );
};

export default observer(Editor);
