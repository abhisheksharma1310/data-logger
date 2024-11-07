import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLogsByDate } from "./showLogsDataSlice";
import DataViewer from "../../components/DataViewer/DataViewer";
import { Button, Select } from "antd";

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

const ShowLogsData = ({ baseURL, date, logType, setShowLog, setLogDate }) => {
  const dispatch = useDispatch();
  const { logs, status, error } = useSelector((state) => state.logs);
  const [type, setType] = useState(logType);

  const loadLogs = () => {
    dispatch(getLogsByDate({ baseURL, date }));
  };

  useEffect(() => {
    loadLogs();
  }, [date]);

  console.log(logs);

  return (
    <div>
      <div className="input-div" style={{ margin: "20px 0" }}>
        <Button
          onClick={() => {
            setShowLog(false);
            setLogDate("");
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
      <DataViewer serialData={type === "db" ? logs?.db : logs?.file} />
    </div>
  );
};

export default ShowLogsData;
