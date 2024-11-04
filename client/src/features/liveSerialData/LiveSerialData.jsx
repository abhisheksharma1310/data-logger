import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearMessages, todayLogs } from "./liveDataSlice";
import { Button } from "antd";
import TextArea from "antd/es/input/TextArea";
import DataViewer from "../../components/DataViewer/DataViewer";

const LiveSerialData = ({ baseURL, ioError, socketRef }) => {
  const dispatch = useDispatch();
  const { messages, isConnected, isPortOpen, status, serverErrors, error } =
    useSelector((state) => state.liveSerialData);
  const [input, setInput] = useState("");

  const retriveTodayLogs = () => {
    dispatch(todayLogs({ baseURL }));
  };

  const sendMessage = () => {
    if (socketRef.current) {
      socketRef.current.emit("serial-data-write", input);
      setInput("");
    }
  };

  return (
    <div>
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
              <h3>Received data:</h3>
              <Button type="primary" onClick={retriveTodayLogs}>
                Sync
              </Button>
              {messages[0] && (
                <Button
                  type="primary"
                  danger
                  onClick={() => dispatch(clearMessages())}
                >
                  Clear data
                </Button>
              )}
            </div>
            <DataViewer serialData={messages} />
          </div>
          <div className="input-item">
            <h3>Send data</h3>
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
