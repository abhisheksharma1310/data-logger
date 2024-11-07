import React, { useEffect, useMemo, useState } from "react";
import { Table, Divider, Tag, Button, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteLogsByDate,
  getLogsHistory,
  setLogType,
  updateLogsHistory,
} from "./logsHistorySlice";
import ShowLogsData from "../ShowLogsData/ShowLogsData";
import CustomModal from "../../components/Modal/CustumModal";

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

const createColumn = (setShowLog, setLogDate, showModal) => {
  const columns = [
    {
      title: "Logs Date",
      dataIndex: "date",
      key: "date",
      render: (date) => (
        <Button
          onClick={() => {
            setLogDate(date);
            setShowLog(true);
          }}
          color="primary"
          type="link"
        >
          {date}
        </Button>
      ),
      defaultSortOrder: "descend",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: "Types",
      key: "types",
      dataIndex: "types",
      render: (types) => (
        <span>
          {types.map((type) => {
            let color = type.length > 5 ? "geekblue" : "green";
            if (type === "file") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={type}>
                {type.toUpperCase()}
              </Tag>
            );
          })}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <span>
          <Button
            onClick={() => {
              setLogDate(record.date);
              setShowLog(true);
            }}
            color="primary"
            type="link"
          >
            View Log {record.date}
          </Button>
          <Divider type="vertical" />
          <Button
            color="danger"
            onClick={() => {
              setLogDate(record.date);
              showModal();
            }}
            type="link"
            danger
          >
            Delete
          </Button>
        </span>
      ),
      defaultSortOrder: "descend",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
  ];
  return columns;
};

const LogsHistory = ({ baseURL }) => {
  const dispatch = useDispatch();
  const { logType, logsHistory, status, error } = useSelector(
    (state) => state.logsHistory
  );
  const [showLog, setShowLog] = useState(false);
  const [logDate, setLogDate] = useState("");
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const columns = createColumn(setShowLog, setLogDate, showModal);

  const loadLogHistory = () => {
    dispatch(getLogsHistory({ baseURL }));
  };

  const reBuildLogHistory = () => {
    dispatch(updateLogsHistory({ baseURL }));
  };

  useEffect(() => {
    if (
      logsHistory?.fileLogsIndex?.length === 0 ||
      logsHistory?.dbLogsIndex?.length === 0
    ) {
      loadLogHistory();
    }
  }, []);

  const logsHistoryData = useMemo(() => {
    let { fileLogsIndex, dbLogsIndex } = logsHistory;
    fileLogsIndex = fileLogsIndex?.map((date, index) => {
      return {
        key: index,
        date: date,
        types: ["file"],
      };
    });
    dbLogsIndex = dbLogsIndex?.map((date, index) => {
      return {
        key: index,
        date: date,
        types: ["database"],
      };
    });
    return { fileLogsIndex, dbLogsIndex };
  }, [logsHistory]);

  const handleLogDelete = () => {
    dispatch(deleteLogsByDate({ baseURL, date: logDate }));
    setTimeout(() => {
      reBuildLogHistory();
    }, [5000]);
  };

  return (
    <>
      {!showLog && (
        <div>
          <CustomModal
            title={"Delete Log"}
            open={open}
            setOpen={setOpen}
            func={handleLogDelete}
          >
            <h3>Delete logs of date: {logDate}</h3>
            <h3>Logs will be deleted from all sources file and database.</h3>
          </CustomModal>
          <div className="input-div" style={{ margin: "20px 0" }}>
            <h3 style={{ display: "inline", paddingRight: "10px" }}>
              Log From
            </h3>
            <Select
              defaultValue={logType}
              style={{
                width: 100,
              }}
              onChange={(e) => dispatch(setLogType(e))}
              options={logTypes}
            />
            <Button onClick={reBuildLogHistory} type="primary">
              Rebuild Log Table
            </Button>
          </div>
          {(logsHistoryData?.fileLogsIndex?.length > 0 ||
            logsHistoryData?.dbLogsIndex?.length > 0) && (
            <Table
              columns={columns}
              dataSource={
                logType === "db"
                  ? logsHistoryData?.dbLogsIndex
                  : logsHistoryData?.fileLogsIndex
              }
            />
          )}
        </div>
      )}
      {showLog && (
        <ShowLogsData
          baseURL={baseURL}
          date={logDate}
          logType={logType}
          setShowLog={setShowLog}
          setLogDate={setLogDate}
        />
      )}
    </>
  );
};

export default LogsHistory;
