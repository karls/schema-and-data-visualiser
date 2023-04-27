import React from "react";
import { Tabs } from "antd";
import Query from "../../components/query/Query";
import { useStore } from "../../stores/store";
import { observer } from "mobx-react-lite";

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const QueryBrowser = observer(() => {
  const rootStore = useStore();
  const queriesStore = rootStore.queriesStore;

  const onTabChange = (newActiveKey: string) => {
    queriesStore.setCurrentQueryId(newActiveKey);
  };

  const add = () => {
    // So this changes the tab to the id of the new query
    onTabChange(queriesStore.addQuery());
  };

  const remove = (targetKey: TargetKey) => {
    queriesStore.removeQuery(targetKey as string);
    if (targetKey === queriesStore.currentQueryId) {
      const newActiveKey = Object.keys(queriesStore.openQueries)[0];
      onTabChange(newActiveKey);
    }
  };

  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: "add" | "remove"
  ) => {
    if (action === "add") {
      add();
    } else {
      remove(targetKey);
    }
  };

  return (
    <Tabs
      type="editable-card"
      onChange={onTabChange}
      activeKey={queriesStore.currentQueryId}
      onEdit={onEdit}
      items={Object.keys(queriesStore.openQueries).map((qid: string) => {
        return {
          label: `Query ${qid}`,
          children: (
            <Query
              getQueryText={() => queriesStore.openQueries[qid].text}
              setQueryText={(text: string) =>
                queriesStore.setQueryText(qid, text)
              }
            />
          ),
          key: qid,
        };
      })}
    />
  );
});

export default QueryBrowser;
