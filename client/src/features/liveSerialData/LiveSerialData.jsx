import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import {
  addMessage,
  clearMessages,
  setConnectionStatus,
  setPortStatus,
  setServerError,
  checkSerialStatus,
} from "./liveDataSlice";
import { Button, Input } from "antd";
import Scrollable from "../../components/Scrollable";
import TextArea from "antd/es/input/TextArea";
import { JsonToTable } from "react-json-to-table";

const LiveSerialData = () => {
  const dispatch = useDispatch();
  const { baseURL } = useSelector((state) => state.baseUrl);
  const { messages, isConnected, isPortOpen, status, serverErrors, error } =
    useSelector((state) => state.liveSerialData);
  const socketRef = useRef(null);
  const [input, setInput] = useState("");
  const [ioError, setIoError] = useState(null);

  const initSerialPort = () => {
    dispatch(checkSerialStatus({ baseURL }));
  };

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
    // listen for serial data json
    socketRef.current.on("serial-data-json", (data) => {
      dispatch(addMessage(data));
    });
    // listen for serial data raw
    socketRef.current.on("serial-data-raw", (data) => {
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

  const sendMessage = () => {
    if (socketRef.current) {
      socketRef.current.emit("serial-data-write", input);
      setInput("");
    }
  };

  useEffect(() => {
    return () => {
      handleDisconnect();
    };
  }, []);

  return (
    <div>
      {status !== "succeeded" && (
        <Button type="primary" onClick={initSerialPort}>
          check port status
        </Button>
      )}
      {status === "succeeded" && <p>Serial port working fine.</p>}
      {status === "failed" && <p>{error}</p>}
      <div className="input-div">
        {status === "succeeded" && (
          <Button
            type="primary"
            onClick={isConnected ? handleDisconnect : handleConnect}
            danger={isConnected}
          >
            {isConnected ? "Disconnect" : "Connect for real time data"}
          </Button>
        )}
      </div>
      <div>
        <h3>
          Server Connection Status: {isConnected ? "Connected" : "Disconnected"}
        </h3>
        <h3>Port Connection Status: {isPortOpen ? "opened" : "closed"}</h3>
        {ioError && <h3>{ioError.toString()}</h3>}
      </div>
      {isConnected && isPortOpen && (
        <div className="display-flex g-25">
          <div className="max-width">
            <div className="display-flex">
              <h3>Received Messages:</h3>
              {messages[0] && (
                <Button
                  type="primary"
                  danger
                  onClick={() => dispatch(clearMessages())}
                >
                  Clear Message
                </Button>
              )}
            </div>
            <Scrollable height="360px">
              <JsonToTable json={messages} />
            </Scrollable>
          </div>
          <div className="input-item">
            <h3>Send Message</h3>
            <TextArea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter message"
              required
            ></TextArea>
            <Button
              type="primary"
              onClick={sendMessage}
              disabled={!isConnected}
              style={{ margin: "10px 0" }}
            >
              Send
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveSerialData;
