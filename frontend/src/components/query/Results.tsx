import React, { useState } from "react";
import { Space, Switch, Table, Tooltip } from "antd";
import { QueryResults } from "../../types";
import { removePrefix } from "../../utils/queryResults";
import Fullscreen from "./Fullscreen";
import { useStore } from "../../stores/store";
import { observer } from "mobx-react-lite";
import { BiHide, BiShow } from "react-icons/bi";

type QueryResultsProps = {
  results: QueryResults;
  loading: boolean;
};

const ResultsTable = observer(({ results, loading }: QueryResultsProps) => {
  const rootStore = useStore();
  const settings = rootStore.settingsStore;
  const { header, data } = results;
  const cellHeight = 55;
  const [showPrefix, setShowPrefix] = useState<boolean>(false);
  const height = Math.floor(
    window.screen.height * (settings.fullScreen ? 0.8 : 0.5)
  );
  return (
    <Fullscreen>
      <Space>
        <Switch
          checked={showPrefix}
          onChange={(checked: boolean) => setShowPrefix(checked)}
          checkedChildren={<BiShow size={15} style={{ marginBottom: 1 }} />}
          unCheckedChildren={<BiHide size={15} style={{ marginBottom: 1 }} />}
        />
        Show Prefix
      </Space>
      <Table
        loading={loading}
        pagination={{
          position: ["topCenter"],
          pageSize: Math.floor(height / cellHeight) - 1,
        }}
        dataSource={data.map((row, index) => {
          const values: any = {};
          for (let i = 0; i < row.length; i++) {
            values[header[i]] = showPrefix ? row[i] : removePrefix(row[i]);
          }
          values.key = `${index}`;
          return values;
        })}
        columns={header.map((column) => {
          return {
            title: column,
            dataIndex: column,
            key: column,
            ellipsis: {
              showTitle: false,
            },
            render: (value) => (
              <Tooltip placement="topLeft" title={value}>
                {value}
              </Tooltip>
            ),
          };
        })}
      />
    </Fullscreen>
  );
});

export default ResultsTable;
