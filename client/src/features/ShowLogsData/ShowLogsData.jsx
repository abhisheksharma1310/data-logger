import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLogsByDate } from "./showLogsDataSlice";
import DataViewer from "../../components/DataViewer/DataViewer";
import { Button, Select, Spin } from "antd";

const logTypes = [
  {
    value: "db",
    label: "Database",
  },
  {
    value: "file",
    label: "Files",
  },
];

const ShowLogsData = ({ baseURL, date, logType, setShowLog, setLogData }) => {
  const dispatch = useDispatch();
  const { logs, status, error } = useSelector((state) => state.logs);
  const [type, setType] = useState(logType);

  const loadLogs = () => {
    dispatch(getLogsByDate({ baseURL, date }));
  };

  useEffect(() => {
    loadLogs();
  }, [date]);

  return (
    <div>
      <div className="input-div" style={{ margin: "20px 0" }}>
        <Button
          onClick={() => {
            setShowLog(false);
            setLogData("");
          }}
          type="primary"
        >
          Go Back
        </Button>
        <h3 style={{ display: "inline", paddingRight: "10px" }}>
          Show Log from
        </h3>
        <Select
          defaultValue={logType}
          style={{
            width: 100,
          }}
          onChange={(e) => setType(e)}
          options={logTypes}
        />
      </div>
      <Spin spinning={status === "loading"} percent={"auto"} />
      {status === "succeeded" && (
        <DataViewer serialData={type === "db" ? logs?.db : logs?.file} />
      )}
      {status === "fail" && <p>{error.toString()}</p>}
    </div>
  );
};

export default ShowLogsData;
