import React from "react";
import { Skeleton, Tabs, TabsProps } from "antd";
import { DotChartOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import QueryEditor from "../../components/query-editor/QueryEditor";
import VisualiseResults from "../../components/visualise-results/VisualiseResults";

const items: TabsProps["items"] = [
  {
    key: "1",
    label: (
      <>
        <QuestionCircleOutlined /> SPARQL query
      </>
    ),
    children: <QueryEditor />,
  },
  {
    key: "2",
    label: (
      <>
        <DotChartOutlined />
        Visualise results
      </>
    ),
    children: <VisualiseResults />,
  },
];

const HomePage: React.FC = () => {
  return (
    <>
      <Tabs items={items} onChange={() => {}} />
    </>
  );
};

export default HomePage;
