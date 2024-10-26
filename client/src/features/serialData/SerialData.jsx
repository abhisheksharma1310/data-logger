import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  configureSerial,
  startLogging,
  fetchLogsByDate,
  setBaseURL,
} from "./serialSlice";

const SerialData = () => {
  const dispatch = useDispatch();
  const { baseURL, status, error, logs } = useSelector((state) => state.serial);

  const [comport, setComport] = useState("");
  const [baudrate, setBaudrate] = useState("");
  const [logToFile, setLogToFile] = useState(false);
  const [logToDatabase, setLogToDatabase] = useState(true);
  const [mongoURL, setMongoURL] = useState("");
  const [fileFormat, setFileFormat] = useState("text");
  const [logDate, setLogDate] = useState("");

  const handleConfigure = () => {
    dispatch(configureSerial({ baseURL, comport, baudrate }));
  };

  const handleStartLogging = () => {
    const loggingConfig = {
      logToFile,
      logToDatabase,
      mongoConfig: { url: mongoURL },
      fileFormat,
    };
    dispatch(startLogging({ baseURL, loggingConfig }));
  };

  const handleFetchLogs = () => {
    dispatch(fetchLogsByDate({ baseURL, date: logDate }));
  };

  return (
    <div>
      <h2>Serial Configuration</h2>
      <div>
        <label>API Base URL: </label>
        <input
          type="text"
          value={baseURL}
          onChange={(e) => dispatch(setBaseURL(e.target.value))}
        />
      </div>
      <div>
        <label>COM Port: </label>
        <input
          type="text"
          value={comport}
          onChange={(e) => setComport(e.target.value)}
        />
      </div>
      <div>
        <label>Baudrate: </label>
        <input
          type="text"
          value={baudrate}
          onChange={(e) => setBaudrate(e.target.value)}
        />
      </div>
      <button onClick={handleConfigure}>Configure Serial Port</button>

      <h2>Start Logging</h2>
      <div>
        <label>Log to File: </label>
        <input
          type="checkbox"
          checked={logToFile}
          onChange={(e) => setLogToFile(e.target.checked)}
        />
      </div>
      <div>
        <label>Log to Database: </label>
        <input
          type="checkbox"
          checked={logToDatabase}
          onChange={(e) => setLogToDatabase(e.target.checked)}
        />
      </div>
      <div>
        <label>MongoDB URL: </label>
        <input
          type="text"
          value={mongoURL}
          onChange={(e) => setMongoURL(e.target.value)}
        />
      </div>
      <div>
        <label>File Format: </label>
        <input
          type="text"
          value={fileFormat}
          onChange={(e) => setFileFormat(e.target.value)}
        />
      </div>
      <button onClick={handleStartLogging}>Start Logging</button>

      <h2>Fetch Logs by Date</h2>
      <div>
        <label>Log Date: </label>
        <input
          type="date"
          value={logDate}
          onChange={(e) => setLogDate(e.target.value)}
        />
      </div>
      <button onClick={handleFetchLogs}>Fetch Logs</button>

      {status === "loading" && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {logs.length > 0 && (
        <div>
          <h3>Logs:</h3>
          <pre>{JSON.stringify(logs, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default SerialData;
