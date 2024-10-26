import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import {
  addMessage,
  clearMessages,
  setConnectionStatus,
  setConnectionDetails,
} from "./socketSlice";
import { Button, Input } from "antd";
import Scrollable from "../../components/Scrollable";
import TextArea from "antd/es/input/TextArea";
import { JsonToTable } from "react-json-to-table";

const SocketIoData = () => {
  const [input, setInput] = useState("");
  const [sentEventName, setSentEventName] = useState("message");
  const [receiveEventName, setReceiveEventName] = useState("message");
  const [error, setError] = useState(null);
  const [serverURL, setServerURL] = useState("http://localhost:5000");
  const socketRef = useRef(null);
  const dispatch = useDispatch();
  const { messages, isConnected, connectionDetails } = useSelector(
    (state) => state.socketIo
  );

  const handleConnect = () => {
    if (!serverURL) return;
    if (socketRef.current) socketRef.current.disconnect();

    socketRef.current = io(serverURL, {
      reconnectionAttempts: 5, // Number of reconnection attempts before giving up
      timeout: 10000, // Time before connection attempt times out
    });
    socketRef.current.on("connect", () => {
      dispatch(setConnectionStatus(true));
      dispatch(
        setConnectionDetails({
          id: socketRef.current.id,
          transport: socketRef.current.io.engine.transport.name,
        })
      );
      setError(null);
    });
    socketRef.current.on("connect_error", (err) => {
      console.error("Connection Error:", err);
      setError("Failed to connect to the server. Please try again later.");
    });
    socketRef.current.on(receiveEventName, (data) => {
      dispatch(addMessage(data));
    });
    socketRef.current.on("disconnect", () => {
      dispatch(setConnectionStatus(false));
      dispatch(setConnectionDetails({}));
    });
  };

  const handleDisconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      dispatch(setConnectionStatus(false));
      dispatch(setConnectionDetails({}));
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
      <div className="input-div">
        <Input
          addonBefore="Socket.Io URL"
          type="text"
          placeholder="Socket Server URL"
          value={serverURL}
          onChange={(e) => setServerURL(e.target.value)}
          className="input-item"
        />
        <Input
          addonBefore="Sent Event Name"
          type="text"
          placeholder="Sent Event Name"
          value={sentEventName}
          onChange={(e) => setSentEventName(e.target.value)}
          className="input-item"
        />
        <Input
          addonBefore="Receive Event Name"
          type="text"
          placeholder="Receive Event Name"
          value={receiveEventName}
          onChange={(e) => setReceiveEventName(e.target.value)}
          className="input-item"
        />
        <Button
          type="primary"
          onClick={isConnected ? handleDisconnect : handleConnect}
          danger={isConnected}
        >
          {isConnected ? "Disconnect" : "Connect"}
        </Button>
      </div>
      <div>
        <h3>
          Connection Status: {isConnected ? "Connected" : "Disconnected"}
          {isConnected && <>, Client Id: {connectionDetails?.id}</>}
        </h3>
        {error && <h3>{error.toString()}</h3>}
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

export default SocketIoData;
