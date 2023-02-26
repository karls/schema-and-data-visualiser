import React from "react";
import { Table, Tooltip } from "antd";
import { QueryResult } from "../../types";

type QueryResultsProps = {
  results: QueryResult;
  loading: boolean;
};

const QueryResults = ({ results, loading }: QueryResultsProps) => {
  const { header, data } = results;

  return (
    <>
      <Table
        loading={loading}
        pagination={{ pageSize: 5 }}
        dataSource={data.map(([s, p, o], index) => {
          return { s, p, o, key: `${index}` };
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
