import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import {
  addMessage,
  clearMessages,
  setConnectionStatus,
  checkSerialStatus,
} from "./liveDataSlice";
import { Button, Input } from "antd";
import Scrollable from "../../components/Scrollable";
import TextArea from "antd/es/input/TextArea";
import { JsonToTable } from "react-json-to-table";

const LiveSerialData = () => {
  const dispatch = useDispatch();
  const { baseURL } = useSelector((state) => state.baseUrl);
  const { messages, isConnected, isPortOpen, status, error } = useSelector(
    (state) => state.liveSerialData
  );
  const socketRef = useRef(null);
  const [input, setInput] = useState("");
  const [sentEventName, setSentEventName] = useState("message");
  const [receiveEventName, setReceiveEventName] = useState("message");
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
    socketRef.current.on("connect", () => {
      dispatch(setConnectionStatus(true));
      setIoError(null);
    });
    socketRef.current.on("connect_error", (err) => {
      console.error("Connection Error:", err);
      setIoError("Failed to connect to the server. Please try again later.");
    });
    socketRef.current.on(receiveEventName, (data) => {
      dispatch(addMessage(data));
    });
    socketRef.current.on("disconnect", () => {
      dispatch(setConnectionStatus(false));
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
      socketRef.current.emit(sentEventName, input);
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
        {ioError && <h3>{ioError.toString()}</h3>}
      </div>
      {isConnected && (
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
