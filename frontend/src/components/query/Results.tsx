import React from "react";
import { Table, Tooltip } from "antd";
import { QueryResults } from "../../types";
import { removePrefix } from "../../utils/queryResults";
import Fullscreen from "./Fullscreen";
import { useStore } from "../../stores/store";
import { observer } from "mobx-react-lite";

type QueryResultsProps = {
  results: QueryResults;
  loading: boolean;
  showPrefix: boolean;
};

const Results = observer(({ results, loading, showPrefix }: QueryResultsProps) => {
  const rootStore = useStore();
  const settings = rootStore.settingsStore;
  const { header, data } = results;
  
  return (
    <Fullscreen>
      <Table
        loading={loading}
        pagination={{ pageSize: settings.fullScreen ? 20 : 4 }}
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

export default Results;
