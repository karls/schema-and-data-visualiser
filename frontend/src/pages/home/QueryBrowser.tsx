import React, { useState } from "react";
import { Tabs } from "antd";
import Query from "../../components/query/Query";
import { useStore } from "../../stores/store";

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const QueryBrowser: React.FC = () => {
  const rootStore = useStore();
  const queriesStore = rootStore.queriesStore;
  const initialItems = Object.keys(queriesStore.getOpenQueries()).map((qid) => {
    return {
      label: `Query ${qid}`,
      children: (
        <Query
          getQueryText={() => queriesStore.getOpenQueries()[qid].text}
          setQueryText={(text: string) => queriesStore.setQueryText(qid, text)}
        />
      ),
      key: qid,
    };
  });

  const [activeKey, setActiveKey] = useState(queriesStore.getCurrentQueryId());
  const [items, setItems] = useState(initialItems);

  const onTabChange = (newActiveKey: string) => {
    queriesStore.setCurrentQueryId(newActiveKey);
    setActiveKey(newActiveKey);
  };

  const add = () => {
    const newActiveKey = `${queriesStore.getTotalQueries() + 1}`;
    queriesStore.addQuery(newActiveKey);
    const newPanes = [...items];
    newPanes.push({
      label: `Query ${newActiveKey}`,
      children: (
        <Query
          getQueryText={() => queriesStore.getOpenQueries()[newActiveKey].text}
          setQueryText={(text: string) => queriesStore.setQueryText(newActiveKey, text)}
        />
      ),
      key: newActiveKey,
    });
    setItems(newPanes);
    setActiveKey(newActiveKey);
  };

  const remove = (targetKey: TargetKey) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;
    items.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = items.filter((item) => item.key !== targetKey);

    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setItems(newPanes);
    onTabChange(newActiveKey);
    queriesStore.removeQuery(activeKey);
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
      activeKey={activeKey}
      onEdit={onEdit}
      items={items}
    />
  );
};

export default QueryBrowser;
