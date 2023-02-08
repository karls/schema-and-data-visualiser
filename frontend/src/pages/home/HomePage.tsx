import React from "react";
import { Tabs, TabsProps } from "antd";
import { AiOutlineDotChart } from "react-icons/ai";
import { TbVectorTriangle } from "react-icons/tb";
import QueryEditor from "../../components/query-editor/QueryEditor";
import VisualiseResults from "../../components/visualise-results/VisualiseResults";

const items: TabsProps["items"] = [
  {
    key: "1",
    label: (
      <>
        <TbVectorTriangle size={20} style={{ margin: 5 }}/> SPARQL query
      </>
    ),
    children: <QueryEditor />,
  },
  {
    key: "2",
    label: (
      <>
        <AiOutlineDotChart size={20} style={{ margin: 5 }}/>
        Visualise results
      </>
    ),
    children: <VisualiseResults />,
  },
];

const HomePage: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Tabs items={items} onChange={() => {}} />
    </div>
  );
};

export default HomePage;
