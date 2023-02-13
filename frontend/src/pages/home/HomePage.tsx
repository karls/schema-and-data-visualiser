import React from "react";
import { Layout, theme, Tabs, TabsProps } from "antd";
import { BiNetworkChart } from "react-icons/bi";
import { TbVectorTriangle } from "react-icons/tb";
import QueryBrowser from "./QueryBrowser";
import GraphVisualisation from "../../components/graph-visualisation/GraphVisualisation";
import Sidebar from "../../components/sidebar/Sidebar";

const { Content, Sider } = Layout;

const items: TabsProps["items"] = [
  {
    key: "1",
    label: (
      <>
        <TbVectorTriangle size={20} style={{ margin: 5 }} /> SPARQL query
      </>
    ),
    children: <QueryBrowser />,
  },
  {
    key: "2",
    label: (
      <>
        <BiNetworkChart size={20} style={{ margin: 5 }} />
        Graph
      </>
    ),
    children: <GraphVisualisation />,
  },
];

const HomePage: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout>
      <Sider width={200} style={{ background: colorBgContainer }}>
        <Sidebar />
      </Sider>
      <Layout style={{ padding: "0 24px 24px" }}>
        <Content
          style={{
            padding: 24,
            margin: 0,
            background: colorBgContainer,
          }}
        >
          <Tabs items={items} onChange={() => {}} />
        </Content>
      </Layout>
    </Layout>
  );
};

export default HomePage;
