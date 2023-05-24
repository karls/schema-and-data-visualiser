import React from "react";
import { Input, Tabs } from "antd";
import Query from "../../components/query/Query";
import { useStore } from "../../stores/store";
import { observer } from "mobx-react-lite";
import "./QueryBrowser.css";

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
      style={{ padding: 0 }}
      items={Object.keys(queriesStore.openQueries).map((qid: string) => {
        return {
          label: (
            <Input
              title={queriesStore.openQueries[qid].title}
              onKeyDown={(e) => e.stopPropagation()}
              onChange={(e) => console.log(e.target.value)}
              style={{
                margin: 0,
                cursor: "pointer",
                background: "none",
                borderTop: "none",
                borderLeft: "none",
                borderRight: "none",
              }}
              defaultValue={queriesStore.getQueryTitle(qid)}
              onPressEnter={(e) =>
                queriesStore.setQueryTitle(qid, e.currentTarget.value)
              }
              onBlur={(e) =>
                queriesStore.setQueryTitle(qid, e.currentTarget.value)
              }
            />
          ),
          children: (
            <Query
              query={queriesStore.openQueries[qid].sparql}
              setQueryText={(text: string) =>
                queriesStore.setQueryText(qid, text)
              }
              title={queriesStore.getQueryTitle(qid)}
            />
          ),
          key: qid,
        };
      })}
    />
  );
});

export default QueryBrowser;
