import React, { useEffect, useMemo, useState } from "react";
import { Table, Divider, Tag, Button, Select, Input, DatePicker } from "antd";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  deleteLogsByDate,
  getLogsHistory,
  setLogType,
  updateLogsHistory,
} from "./logsHistorySlice";
import ShowLogsData from "../ShowLogsData/ShowLogsData";
import CustomModal from "../../components/Modal/CustumModal";

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

const dateFormat = "YYYY/MM/DD";

const LogsHistory = ({ baseURL }) => {
  const dispatch = useDispatch();
  const { logType, logsHistory, dateRange, status, error } = useSelector(
    (state) => state.logsHistory
  );
  const [showLog, setShowLog] = useState(false);
  const [logDate, setLogDate] = useState("");
  const [open, setOpen] = useState(false);
  const [searchDate, setSearchDate] = useState({
    startDate:
      logType === "db" ? dateRange?.db?.startDate : dateRange?.file?.startDate,
    endDate:
      logType === "db" ? dateRange?.db?.endDate : dateRange?.file?.endDate,
  });

  console.log(searchDate);

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

    let { fileLogsIndex, dbLogsIndex } = logsHistory;

    fileLogsIndex = fileLogsIndex
      ?.filter(
        (date) =>
          normalizeDate(date) >= normalizeDate(searchDate.startDate) &&
          normalizeDate(date) <= normalizeDate(searchDate.endDate)
      )
      .map((date, index) => ({
        key: index,
        date: date,
        types: ["file"],
      }));

    dbLogsIndex = dbLogsIndex
      ?.filter(
        (date) =>
          normalizeDate(date) >= normalizeDate(searchDate.startDate) &&
          normalizeDate(date) <= normalizeDate(searchDate.endDate)
      )
      .map((date, index) => ({
        key: index,
        date: date,
        types: ["database"],
      }));

    return { fileLogsIndex, dbLogsIndex };
  }, [logsHistory, searchDate, logType]);

  const handleLogDelete = () => {
    dispatch(deleteLogsByDate({ baseURL, date: logDate }));
    setTimeout(() => {
      reBuildLogHistory();
    }, [5000]);
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
