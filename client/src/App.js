import * as React from "react";
import { ConfigProvider, theme } from "antd";
import MainLayout from "./components/layout/main-layout";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import SerialConfig from "./features/serialConfig/SerialConfig";
import LiveSerialData from "./features/liveSerialData/LiveSerialData";

export default function App() {
  return (
    <div className="App">
      <Router>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#00b96b",
              // colorBgContainer: "#001529",
              colorPrimaryText: "#ffffff",
              // 1. Use dark algorithm
              algorithm: theme.darkAlgorithm,
            },
          }}
        >
          <MainLayout>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/serial-config" element={<SerialConfig />} />
              <Route path="/serial-live" element={<LiveSerialData />} />
            </Routes>
          </MainLayout>
        </ConfigProvider>
      </Router>
    </div>
  );
}
