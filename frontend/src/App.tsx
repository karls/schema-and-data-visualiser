import React from "react";
import { Layout, theme } from "antd";
import Navbar from "./components/navbar/Navbar";
import { routes } from "./components/navbar/routes";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import { observer } from "mobx-react-lite";
import { useStore } from "./stores/store";

const { Header, Content, Sider } = Layout;


const router = createBrowserRouter(routes);

const App = observer(() => {
  const { settings } = useStore();
  console.log(settings);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ height: "100vh" }}>
      <Header className="header">
        <Navbar />
      </Header>
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
            <RouterProvider router={router} />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
});

export default App;
