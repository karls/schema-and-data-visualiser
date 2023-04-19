import React from "react";
import { ConfigProvider, Layout, theme } from "antd";
import Navbar from "./components/navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import { observer } from "mobx-react-lite";
import Settings from "./components/settings/Settings";
import { useStore } from "./stores/store";
import HomePage from "./pages/home/HomePage";
import ContactPage from "./pages/contact/ContactPage";

const { Header } = Layout;
const { darkAlgorithm, defaultAlgorithm } = theme;

const App = () => {
  const rootStore = useStore();
  const settings = rootStore.settingsStore;

  return (
    <ConfigProvider
      theme={{
        algorithm: settings.darkMode ? darkAlgorithm : defaultAlgorithm,
      }}
    >
      <Layout style={{ height: "100vh" }}>
        <Header className="header">
          <Navbar />
        </Header>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </Layout>
        <Settings />
      </Layout>
    </ConfigProvider>
  );
};

export default observer(App);
