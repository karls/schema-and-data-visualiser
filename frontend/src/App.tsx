import React from "react";
import { Layout } from "antd";
import Navbar from "./components/navbar/Navbar";
import { routes } from "./components/navbar/routes";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { observer } from "mobx-react-lite";

const { Header } = Layout;

const router = createBrowserRouter(routes);

const App = observer(() => {
  return (
    <Layout style={{ height: "100vh" }}>
      <Header className="header">
        <Navbar />
      </Header>
      <Layout>
        <RouterProvider router={router} />
      </Layout>
    </Layout>
  );
});

export default App;
