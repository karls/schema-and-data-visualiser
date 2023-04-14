import React from "react";
import { Table, Tooltip } from "antd";
import { QueryResults } from "../../types";
import { removePrefix } from "../../utils/queryResults";

type QueryResultsProps = {
  results: QueryResults;
  loading: boolean;
  showPrefix: boolean;
};

const Results = ({ results, loading, showPrefix }: QueryResultsProps) => {
  const { header, data } = results;

  return (
    <>
      <Table
        loading={loading}
        pagination={{ pageSize: 5 }}
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
    </>
  );
};

export default Results;
