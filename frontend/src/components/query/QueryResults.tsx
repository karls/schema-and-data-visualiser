import React from "react";
import { Table, Tooltip } from "antd";
import { QueryResults } from "../../types";
import { removePrefix } from "../../utils/queryResults";

type QueryResultsProps = {
  results: QueryResults;
  loading: boolean;
  showPrefix: boolean;
};

const QueryResults = ({ results, loading, showPrefix }: QueryResultsProps) => {
  const { header, data } = results;

  return (
    <>
      <Table
        loading={loading}
        pagination={{ pageSize: 5 }}
        dataSource={data.map(([s, p, o], index) => {
          return {
            s: showPrefix ? s : removePrefix(s),
            p: showPrefix ? p : removePrefix(p),
            o: showPrefix ? o : removePrefix(o),
            key: `${index}`,
          };
        })}
        columns={[
          {
            title: header[0],
            dataIndex: "s",
            key: "subject",
            ellipsis: {
              showTitle: false,
            },
            render: (value) => (
              <Tooltip placement="topLeft" title={value}>
                {value}
              </Tooltip>
            ),
          },
          {
            title: header[1],
            dataIndex: "p",
            key: "predicate",
            ellipsis: {
              showTitle: false,
            },
            render: (value) => (
              <Tooltip placement="topLeft" title={value}>
                {value}
              </Tooltip>
            ),
          },
          {
            title: header[2],
            dataIndex: "o",
            key: "object",
            ellipsis: {
              showTitle: false,
            },
            render: (value) => (
              <Tooltip placement="topLeft" title={value}>
                {value}
              </Tooltip>
            ),
          },
        ]}
      />
    </>
  );
};

export default QueryResults;
