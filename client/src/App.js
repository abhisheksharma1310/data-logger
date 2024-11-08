import React, { useState, useEffect, useRef } from "react";
import { ConfigProvider, theme } from "antd";
import MainLayout from "./components/layout/main-layout";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import {
  addMessage,
  setConnectionStatus,
  setPortStatus,
  setServerError,
} from "./features/liveSerialData/liveDataSlice";
import "./App.css";
import Home from "./components/Home";
import SerialConfig from "./features/serialConfig/SerialConfig";
import LiveSerialData from "./features/liveSerialData/LiveSerialData";
import LogsHistory from "./features/logsHistory/LogsHistory";

export default function App() {
  const dispatch = useDispatch();
  const { baseURL } = useSelector((state) => state.baseUrl);
  const socketRef = useRef(null);
  const [ioError, setIoError] = useState(null);

  const handleConnect = () => {
    if (!baseURL) return;

    if (socketRef.current) socketRef.current.disconnect();

    socketRef.current = io(baseURL, {
      reconnectionAttempts: 5, // Number of reconnection attempts before giving up
      timeout: 10000, // Time before connection attempt times out
    });
    // on connect
    socketRef.current.on("connect", () => {
      dispatch(setConnectionStatus(true));
      setIoError(null);
    });
    // listen for serial port status
    socketRef.current.on("serial-port", (data) => {
      dispatch(setPortStatus(data));
    });
    // listen for serial data
    socketRef.current.on("serial-data", (data) => {
      dispatch(addMessage(data));
    });
    // listen for server error
    socketRef.current.on("error", (data) => {
      dispatch(setServerError(data));
    });
    // on disconnect
    socketRef.current.on("disconnect", () => {
      dispatch(setConnectionStatus(false));
    });
    // on conncection error
    socketRef.current.on("connect_error", (err) => {
      console.error("Connection Error:", err);
      setIoError("Failed to connect to the server. Please try again later.");
    });
  };

  const handleDisconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      dispatch(setConnectionStatus(false));
    }
  };

  useEffect(() => {
    handleConnect();

    return () => {
      handleDisconnect();
    };
  }, [baseURL]);

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
              <Route
                path="/serial-live"
                element={
                  <LiveSerialData
                    baseURL={baseURL}
                    ioError={ioError}
                    socketRef={socketRef}
                  />
                }
              />
              <Route
                path="/logs-history"
                element={<LogsHistory baseURL={baseURL} />}
              />
            </Routes>
          </MainLayout>
        </ConfigProvider>
      </Router>
    </div>
  );
}
