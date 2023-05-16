import React, { useState } from "react";
import { Space, Tabs, TabsProps } from "antd";
import { observer } from "mobx-react-lite";
import { BiNetworkChart } from "react-icons/bi";
import { BsBarChartSteps, BsTable } from "react-icons/bs";
import { useStore } from "../../stores/store";
import { QueryResults, Triplet } from "../../types";
import { isEmpty, isGraph } from "../../utils/queryResults";
import Graph from "./Graph";
import Editor from "./Editor";
import Results from "./Results";
import Charts from "./Charts";
import { MdOutlineEditNote } from "react-icons/md";

type QueryProps = {
  getQueryText: () => string;
  setQueryText: any;
};

const Query = observer(({ getQueryText, setQueryText }: QueryProps) => {
  const rootStore = useStore();
  const settings = rootStore.settingsStore;
  const repositoryStore = rootStore.repositoryStore;

  const [results, setResults] = useState<QueryResults>({
    header: [],
    data: [],
  });

  const [graphKey, setGraphKey] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("editor");

  const width = Math.floor(
    (window.screen.width - (settings.fullScreen ? 0 : settings.sidebarWidth)) *
      (settings.fullScreen ? 0.95 : 0.85)
  );
  const height = Math.floor(
    window.screen.height * (settings.fullScreen ? 0.75 : 0.6)
  );

  const items: TabsProps["items"] = [
    {
      key: "editor",
      label: (
        <Space.Compact>
          <MdOutlineEditNote size={25} />
          Query
        </Space.Compact>
      ),
      children: (
        <Editor
          getQueryText={getQueryText}
          onChange={setQueryText}
          onRun={(results) => {
            setResults(results);
            setGraphKey((key) => key + 1);
            repositoryStore.updateQueryHistory();
            setLoading(false);
            setActiveTab("results");
          }}
          width={width}
          height={height}
          loading={loading}
          setLoading={setLoading}
        />
      ),
    },
    {
      key: "results",
      label: (
        <Space.Compact>
          <BsTable size={15} style={{ margin: 5 }} />
          Results
        </Space.Compact>
      ),
      children: <Results results={results} loading={loading} />,
    },
    {
      key: "graph",
      label: (
        <Space.Compact title="Use CONSTRUCT for a graph">
          <BiNetworkChart size={20} style={{ margin: 5 }} />
          Graph
        </Space.Compact>
      ),
      disabled: results.data.length === 0 || !isGraph(results),
      children: (
        <Graph
          key={graphKey}
          links={results.data as Triplet[]}
          repository={repositoryStore.currentRepository!}
        />
      ),
    },
    {
      key: "charts",
      label: (
        <Space.Compact>
          <BsBarChartSteps size={15} style={{ margin: 5 }} />
          Charts
        </Space.Compact>
      ),
      disabled: isEmpty(results),
      children: <Charts results={results} />,
    },
  ];

  return (
    <>
      <Tabs
        activeKey={activeTab}
        items={items}
        onChange={(activeKey) => setActiveTab(activeKey)}
      />
    </>
  );
});

export default Query;
