import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearMessages, todayLogs } from "./liveDataSlice";
import { Button } from "antd";
import TextArea from "antd/es/input/TextArea";
import DataViewer from "../../components/DataViewer/DataViewer";
import MessageModal from "../../components/Modal/MessageModal";

const LiveSerialData = ({ baseURL, ioError, socketRef }) => {
  const dispatch = useDispatch();
  const { messages, isConnected, isPortOpen, status, serverErrors, error } =
    useSelector((state) => state.liveSerialData);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);

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
        <div className="display-flex-col">
          <div>
            <div className="display-flex">
              <h3>Received data:</h3>
              <Button type="primary" onClick={retriveTodayLogs}>
                Sync
              </Button>
              <Button type="primary" onClick={() => setOpen((p) => !p)}>
                Send Message
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
          <MessageModal
            title="Send data to serial port"
            open={open}
            setOpen={setOpen}
            sendMessage={sendMessage}
            isConnected={isConnected}
          >
            <TextArea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter message"
              required
            ></TextArea>
          </MessageModal>
        </div>
      )}
    </div>
  );
};

export default LiveSerialData;
