import React, { useEffect, useMemo, useState } from "react";
import { Table, Divider, Tag, Button, Select, DatePicker } from "antd";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  deleteLogsByDate,
  getLogsHistory,
  setLogType,
  updateLogsHistory,
} from "./logsHistorySlice";
import ShowLogsData from "../ShowLogsData/ShowLogsData";
import DeleteModal from "../../components/Modal/DeleteModal";

const { RangePicker } = DatePicker;

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

const createColumn = (setShowLog, setLogData, showModal) => {
  const columns = [
    {
      title: "Logs Date",
      dataIndex: "date",
      key: "date",
      render: (date) => (
        <Button
          onClick={() => {
            setLogData({ date: date });
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
      title: "Storage Type",
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
              setLogData(record);
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
              setLogData(record);
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

const dateFormat = "YYYY/MM/DD";

const LogsHistory = ({ baseURL }) => {
  const dispatch = useDispatch();
  const { logType, logsHistory, dateRange, status, error } = useSelector(
    (state) => state.logsHistory
  );
  const [showLog, setShowLog] = useState(false);
  const [logData, setLogData] = useState("");
  const [open, setOpen] = useState(false);
  const [searchDate, setSearchDate] = useState({
    startDate:
      logType === "db" ? dateRange?.db?.startDate : dateRange?.file?.startDate,
    endDate:
      logType === "db" ? dateRange?.db?.endDate : dateRange?.file?.endDate,
  });

  const showModal = () => {
    setOpen(true);
  };

  const columns = createColumn(setShowLog, setLogData, showModal);

  const loadLogHistory = () => {
    dispatch(getLogsHistory({ baseURL }));
  };

  const reBuildLogHistory = () => {
    dispatch(updateLogsHistory({ baseURL }));
  };

  const handleDateRange = (e) => {
    const [start, end] = e;
    const startDate = `${start?.$y}/${start?.$M + 1}/${start?.$D}`;
    const endDate = `${end?.$y}/${end?.$M + 1}/${end?.$D}`;
    setSearchDate({ startDate, endDate });
  };

  const logsHistoryData = useMemo(() => {
    const normalizeDate = (dateString) => {
      const date = new Date(dateString);
      date.setHours(0, 0, 0, 0); // Set time to midnight for accurate date comparison
      return date;
    };

    const { fileLogsIndex, dbLogsIndex } = logsHistory;

    const fileLogs = fileLogsIndex
      ?.filter(
        (date) =>
          normalizeDate(date) >= normalizeDate(searchDate.startDate) &&
          normalizeDate(date) <= normalizeDate(searchDate.endDate)
      )
      .map((date, index) => ({
        key: index,
        date: date,
        types: dbLogsIndex.includes(date) ? ["file", "database"] : ["file"],
      }));

    const dbLogs = dbLogsIndex
      ?.filter(
        (date) =>
          normalizeDate(date) >= normalizeDate(searchDate.startDate) &&
          normalizeDate(date) <= normalizeDate(searchDate.endDate)
      )
      .map((date, index) => ({
        key: index,
        date: date,
        types: fileLogsIndex.includes(date)
          ? ["file", "database"]
          : ["database"],
      }));

    return { fileLogs, dbLogs };
  }, [logsHistory, searchDate, logType]);

  const handleLogDelete = (option) => {
    if (option === "deleteFromDB") {
      dispatch(deleteLogsByDate({ baseURL, date: logData.date, option }));
    } else if (option === "deleteFromFile") {
      dispatch(deleteLogsByDate({ baseURL, date: logData.date, option }));
    } else if (option === "deleteFromBoth") {
      dispatch(deleteLogsByDate({ baseURL, date: logData.date, option }));
    }
    setTimeout(() => {
      reBuildLogHistory();
    }, [3000]);
  };

  useEffect(() => {
    if (
      logsHistory?.fileLogsIndex?.length === 0 ||
      logsHistory?.dbLogsIndex?.length === 0
    ) {
      loadLogHistory();
    }
  }, []);

  return (
    <>
      {logData && (
        <DeleteModal
          title={"Delete Log"}
          open={open}
          setOpen={setOpen}
          func={handleLogDelete}
          data={logData}
        >
          <h3>Delete logs of date: {logData.date}</h3>
        </DeleteModal>
      )}
      {!showLog && (
        <div>
          <div className="input-div" style={{ margin: "20px 0" }}>
            <h3 style={{ display: "inline", paddingRight: "10px" }}>
              Log From
            </h3>
            <Select
              defaultValue={logType}
              style={{
                width: "100px",
              }}
              onChange={(e) => {
                dispatch(setLogType(e));
              }}
              options={logTypes}
            />
            <RangePicker
              onChange={handleDateRange}
              format={dateFormat}
              minDate={dayjs(
                logType === "db"
                  ? dateRange?.db?.startDate
                  : dateRange?.file?.startDate
              )}
              maxDate={dayjs(
                logType === "db"
                  ? dateRange?.db?.endDate
                  : dateRange?.file?.endDate
              )}
            />
            <Button onClick={reBuildLogHistory} type="primary">
              Rebuild Log Table
            </Button>
          </div>
          {(logsHistoryData?.fileLogs?.length > 0 ||
            logsHistoryData?.dbLogs?.length > 0) && (
            <Table
              columns={columns}
              dataSource={
                logType === "db"
                  ? logsHistoryData?.dbLogs
                  : logsHistoryData?.fileLogs
              }
            />
          )}
        </div>
      )}
      {showLog && (
        <ShowLogsData
          baseURL={baseURL}
          date={logData?.date}
          logType={logType}
          setShowLog={setShowLog}
          setLogData={setLogData}
        />
      )}
    </>
  );
};

export default LogsHistory;
