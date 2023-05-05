import React from "react";
import { Layout, theme } from "antd";
import QueryBrowser from "./QueryBrowser";
import Sidebar from "../../components/sidebar/Sidebar";
import { useStore } from "../../stores/store";

const { Content, Sider } = Layout;

const HomePage = () => {
  const rootStore = useStore();
  const settings = rootStore.settingsStore;

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout>
      <Sider
        width={settings.sidebarWidth}
        style={{ background: colorBgContainer }}
      >
        <Sidebar />
      </Sider>
      <Layout style={{ padding: "0 10px " }}>
        <Content
          style={{
            padding: 24,
            margin: 0,
            background: colorBgContainer,
          }}
        >
          <QueryBrowser />
        </Content>
      </Layout>
    </Layout>
  );
};

export default HomePage;
