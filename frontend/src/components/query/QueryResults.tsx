import React from "react";
import { Table } from "antd";
import { Triplet } from "../../types";

type QueryResultsProps = {
  results: Triplet[];
};

const QueryResults = ({ results }: QueryResultsProps) => {
  return (
    <>
      <Table
        pagination={{ pageSize: 5 }}
        dataSource={results.map((t, index) => {
          return { ...t, key: `${index}` };
        })}
        columns={[
          {
            title: "Subject",
            dataIndex: "s",
            key: "subject",
          },
          {
            title: "Predicate",
            dataIndex: "p",
            key: "predicate",
          },
          {
            title: "Object",
            dataIndex: "o",
            key: "object",
          },
        ]}
      />
    </>
  );
};

export default QueryResults;
